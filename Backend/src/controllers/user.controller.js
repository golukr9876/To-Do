import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { pool } from "../config/db.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateOtp, getOtpHtml } from "../utils/otpmail.js";
import { sendMail } from "../services/email.service.js";

const cookieOptions = {
  httpOnly: true,
  secure: true,
};

const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};

const sendOtp = asyncHandler(async (email, next) => {
 
    const otp = generateOtp();
    const html = getOtpHtml(otp);
    const otpHash = await bcrypt.hash(otp, 10);
    sendMail(email, "OTP Verification", `Your OTP code is ${otp}`, html);
 try {
    const res = await pool.query("select * from otpSchema where email=$1", [
      email,
    ]);
    if (res.rows.length > 0) {
      await pool.query(`update otpSchema set otp=$1, expires_at=NOW() + INTERVAL '10 minutes' where email=$2`, [
        otpHash,
        email,
      ]);
    } else {
      await pool.query(
        `insert into otpSchema (email, otp, expires_at) values ($1, $2, NOW() + INTERVAL '10 minutes')`,
        [email, otpHash]
      );
    }
  } catch (error) {
    next(error);
  }
});

const uploadAvatar = asyncHandler(async (req, res, next) => {
  const user_id = req.user.id;
  if (!user_id) {
    throw new ApiError(400, "Authentication required");
  }
  const response = await pool.query(
    "select verified from users where user_id=$1",
    [user_id]
  );
  if (response.rows.length === 0) {
    throw new ApiError(400, "user doesnot exist anymore");
  }
  if (!response.rows[0].verified) {
    throw new ApiError(400, "user not verified");
  }
  const localpath = req.file?.path;
  console.log("localPath", localpath);
  if (!localpath) {
    throw new ApiError(400, "image is required to upload");
  }

  const avatar = await uploadOnCloudinary(localpath);
  if (!avatar?.secure_url) {
    throw new ApiError(400, "Error while uploading the image");
  }

  try {
    const avatarRes = await pool.query(
      "update users set avatar=$1 where user_id=$2 returning avatar",
      [avatar.secure_url, user_id]
    );
    if (avatarRes.rows.length === 0) {
      throw new ApiError(
        500,
        "server error encountered during uploading avatar"
      );
    }

    res
      .status(200)
      .json(new ApiResponse(200, avatarRes.rows[0], "avatar uploaded successfully"));
  } catch (error) {
    next(error);
  }
});

const registerUser = asyncHandler(async (req, res, next) => {
  //extract data from request body
  const { full_name, email, password } = req.body;

  //check all required values
  if (
    !full_name ||
    !email ||
    !password ||
    !full_name.trim() ||
    !email.trim() ||
    !password.trim()
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const userExist = await pool.query("select * from users where email = $1", [
    email,
  ]);
  //checking email exist or not
  if (userExist.rows.length > 0 && userExist.rows[0].verified) {
    throw new ApiError(400, "User Already Registered");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    let result;
    if (userExist.rows.length > 0 && !userExist.rows[0].verified) {
      result = await pool.query(
        "update users set full_name = $1, password=$2 where email=$3 returning user_id, full_name, email",
        [full_name, hashedPassword, email]
      );
    } else {
      result = await pool.query(
        "insert into users (full_name, email, password) values ($1, $2, $3) returning user_id, full_name, email",
        [full_name, email, hashedPassword]
      );
    }
    const createdUser = result.rows[0];
    if (!createdUser) {
      throw new ApiError(500, "Server error encountered during user creation");
    }
    await sendOtp(email, next);
    return res
      .status(201)
      .json(
        new ApiResponse(
          200,
          createdUser,
          "User Registered Successfully but not verified"
        )
      );
  } catch (error) {
    next(error);
  }
});

const verifyEmail = asyncHandler(async (req, res, next) => {
  const { email, otp } = req.body;
  if (!email) {
    throw new ApiError(400, "email is required for verification");
  }
  if (!otp) {
    throw new ApiError(400, "Otp is required");
  }

  try {
    const otpData = await pool.query(
      "select * from otpSchema where email = $1",
      [email]
    );
    if (otpData.rows.length === 0 || otpData.rows[0].expires_at < Date.now()) {
      throw new ApiError(400, "Otp expire.. ");
    }

    const isMatch = await bcrypt.compare(otp, otpData.rows[0].otp);
    if (!isMatch) {
      throw new ApiError(400, "Invalid Otp");
    }

    

    const result = await pool.query("update users set verified=$1 where email=$2 returning *", [
      true,
      email,
    ]);

    const userData = result.rows[0];
    const refreshToken = generateRefreshToken(userData.user_id);
    const accessToken = generateAccessToken(userData.user_id);

    await pool.query(
      'update users set refreshToken=$1 where email=$2', [refreshToken, email]
    )
    res.cookie("refreshToken", refreshToken, cookieOptions);
    res.cookie("accessToken", accessToken, cookieOptions);


    
    await pool.query("delete from otpSchema where email=$1", [email]);
    res.status(200).json(new ApiResponse(200,
       {
        id: userData.user_id,
        full_name: userData.full_name,
        email: userData.email,
        avatar: userData.avatar,
        created_at: userData.registered_at,
       },
        "user verified Successfully"));
  } catch (error) {
    next(error);
  }
});

const loginUser = asyncHandler(async (req, res) => {
  //extract data
  const { email, password } = req.body;

  //check all required values
  if (!email?.trim() || !password?.trim()) {
    throw new ApiError(400, "please provide required details");
  }

  //check email exist or not
  const findUser = await pool.query("select * from users where email = $1", [
    email,
  ]);
  if (findUser.rows.length === 0) {
    throw new ApiError(400, "Invalid Credential");
  }
  const userData = findUser.rows[0];
  if (!userData.verified) {
    throw new ApiError(400, "User not verified");
  }

  const isMatch = await bcrypt.compare(password, userData.password);
  if (!isMatch) {
    throw new ApiError(400, "Invalid Credential");
  }

  const refreshToken = generateRefreshToken(userData.user_id);
  const accessToken = generateAccessToken(userData.user_id);
  await pool.query("update users set refreshToken = $1 where user_id = $2", [
    refreshToken,
    userData.user_id,
  ]);

  res.cookie("refreshToken", refreshToken, cookieOptions);
  res.cookie("accessToken", accessToken, cookieOptions);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        id: userData.user_id,
        full_name: userData.full_name,
        email: userData.email,
        avatar: userData.avatar,
        created_at: userData.registered_at,
      },
      "User Loggend in"
    )
  );
});

const logoutUser = asyncHandler(async (req, res, next) => {
  if (!req.user.id) {
    throw new ApiError(500, "Internal Error while logout");
  }
  await pool.query("update users set refreshToken = $1 where user_id = $2", [
    null,
    req.user.id,
  ]);

  res.cookie("accessToken", "", { ...cookieOptions, maxAge: 1 });
  res.cookie("refreshToken", "", { ...cookieOptions, maxAge: 1 });
  res.status(200).json(new ApiResponse(200, "User Logout Successfully"));
});

const getmyprofile = asyncHandler(async (req, res) => {
  if (!req.user.id) {
    throw new ApiError(500, "internal server error while getting me");
  }
  const user = await pool.query("select * from users where user_id = $1", [
    req.user.id,
  ]);
  if (!user.rows.length) {
    throw new ApiError(400, "user not find at database");
  }
  const userData = user.rows[0];

  res.status(200).json(
    new ApiResponse(
      200,
      {
        id: userData.user_id,
        full_name: userData.full_name,
        email: userData.email,
        avatar: userData.avatar,
        created_at: userData.registered_at,
      },
      "User Data fetched successfully"
    )
  );
});

export { registerUser, loginUser, logoutUser, getmyprofile, verifyEmail, uploadAvatar };

import api from "./axios";

export const loginUser = async (data) => {
  return await api.post("/auth/login", data);
};

export const registerUser = async (data) => {
  return await api.post("/auth/register", data);
};

export const verifyEmail = async (data) => {
  console.log("data", data);
  return await api.post("/auth/verify-email", data);
}

export const uploadAvatar = async (data)=>{
  return await api.patch("/auth/upload-avatar", data);
}

export const getCurrentUser = async () => {
  return await api.get("/auth/me");
  console.log("response : ", response);
};

export const logoutUser = async () => {
  return await api.post("/auth/logout");
};

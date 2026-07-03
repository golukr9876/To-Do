function generateOtp() {
    return Math.floor(100000 + Math.random()*900000).toString();
}

function getOtpHtml(otp) {
    return `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>OTP Verification</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            }
            .otp-container {
            background-color: #fff;
            padding: 20px 30px;
            border-radius: 8px;
          }
        </style>
      </head>
      <body>
        <div class="otp-container">
          <h1>OTP Verification</h1>
          <p>Your OTP is: <strong>${otp}</strong></p>
            <p>Please use this OTP to complete your verification process. This OTP is valid for 10 minutes.</p>
            <p>Do not share this OTP with anyone. If you did not request this OTP, please ignore this email.</p>
            <p>Thank you,<br/>Task Flow</p>
        </div>
      </body>
    </html>`
}

export { generateOtp, getOtpHtml }
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";

// // Register Controller function
// const register = async (req: Request, res: Response) => {

//     const { name, email, password } = req.body;

//     if (!name || !email || !password) {
//         return res.status(400).json({ success: false, message: 'Missing Details' })
//     }

//     try {

//         const existingUser = await userModel.findOne({ email })

//         if (existingUser) {
//             return res.status(400).json({ success: false, message: 'user already exists' })
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);

//         // await userModel.create({
//         //     name: name,
//         //     email: email,                    // this is not more flexible, it also works
//         //     password: hashedPassword
//         // })

//         const user = new userModel({ name, email, password: hashedPassword });
//         await user.save();

//         const jwtSecret = process.env.JWT_SECRET;

//         if (!jwtSecret) {
//             throw new Error('JWT_SECRET is not defined in environment variables');
//         }

//         const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '7d' });

//         res.cookie('token', token, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
//             maxAge: 7 * 24 * 60 * 60 * 1000
//         });

//         const mailOptions = {
//             from: process.env.SMTP_USER,
//             to: email,
//             subject: 'Welcome to Bangalore',
//             text: 'Welcome to Bangalore portal. Your account has been created with email id: ' + email
//         }

//         await transporter.sendMail(mailOptions);

//         return res.status(201).json({ success: true });

//     } catch (error: any) {
//         return res.status(500).json({ success: false, message: error.message })
//     }
// }

const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "Missing Details" });
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({ name, email, password: hashedPassword });

    // Generate OTP for email verification
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.verifyOTP = otp;
    user.verifyOTPExpireAt = Date.now() + 10 * 60 * 1000; // 10 mins expiry

    await user.save();

    console.log("user added to db");

    // Send Verification Email with OTP
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: "Verify Your Email",
      html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Account Verification</title>
      <style>
        body { font-family: 'Segoe UI', sans-serif; background: #f9f9f9; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 10px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        h2 { color: #2d3436; text-align: center; }
        p { font-size: 16px; color: #555; text-align: center; }
        .otp-box { margin: 20px auto; font-size: 32px; font-weight: bold; letter-spacing: 12px; color: #0984e3; background: #eaf4ff; padding: 15px 30px; border-radius: 8px; width: fit-content; }
        .footer { font-size: 13px; color: #999; text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Verify Your Account</h2>
        <p>Use the OTP below to complete your email verification:</p>
        <div class="otp-box">${otp}</div>
        <p>This OTP is valid for 10 minutes.</p>
        <div class="footer">
          If you did not request this, please ignore this email.<br/>
          &copy; 2025 Your App Name
        </div>
      </div>
    </body>
    </html>
  `,
    };
    await transporter.sendMail(mailOptions);

    console.log("nodemailer worked");

    // Create JWT token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) throw new Error("JWT_SECRET not defined in environment");
    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    console.log("cookies set");

    return res.status(201).json({
      success: true,
      message: "Account created. Verification OTP sent to your email.",
      userID: user._id,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// login controller function
const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Missing details" });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ success: true });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Logout controller function
const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.status(200).json({ success: true, message: "Logged out" });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Send Verification OTP to the user's Email (OTP sender function)
const sendVerifyOTP = async (req: Request, res: Response) => {
  try {
    const { userID } = req.body;

    const user = await userModel.findById(userID);

    if (!user)
      return res.status(404).json({
        success: false,
        message: "Please login again before continuing",
      });

    if (user?.isAccountVerfied) {
      return res
        .status(400)
        .json({ success: false, message: "account already verified" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.verifyOTP = otp;
    user.verifyOTPExpireAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: user.email,
      subject: "Account Verification OTP",
      text: `Your OTP is ${otp}. Verify your account using this OTP`,
      html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Account Verification</title>
      <style>
        body { font-family: 'Segoe UI', sans-serif; background: #f9f9f9; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 10px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        h2 { color: #2d3436; text-align: center; }
        p { font-size: 16px; color: #555; text-align: center; }
        .otp-box { margin: 20px auto; font-size: 32px; font-weight: bold; letter-spacing: 12px; color: #0984e3; background: #eaf4ff; padding: 15px 30px; border-radius: 8px; width: fit-content; }
        .footer { font-size: 13px; color: #999; text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Verify Your Account</h2>
        <p>Use the OTP below to complete your email verification:</p>
        <div class="otp-box">${otp}</div>
        <p>This OTP is valid for 10 minutes.</p>
        <div class="footer">
          If you did not request this, please ignore this email.<br/>
          &copy; 2025 Your App Name
        </div>
      </div>
    </body>
    </html>
  `,
    };

    await transporter.sendMail(mailOptions);

    return res
      .status(200)
      .json({ success: true, message: "Verfication OTP sent on Email" });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// controller function to check the OTP what user entered (OTP verifer function)
const verifyEmail = async (req: Request, res: Response) => {
  const { userID, otp } = req.body;

  if (!userID || !otp)
    return res.status(400).json({ success: false, message: "Missing Details" });

  try {
    const user = await userModel.findById(userID);

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "user not found" });

    if (user.verifyOTP === "" || user.verifyOTP !== otp)
      return res.status(400).json({ success: false, message: "Invalid OTP" });

    if (user.verifyOTPExpireAt < Date.now())
      return res.status(400).json({ success: true, message: "OTP Expired" });

    user.isAccountVerfied = true;
    user.verifyOTP = "";
    user.verifyOTPExpireAt = 0;
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Account regsitration successfully" });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// check if user is authenticated

// const isAuthenticated = async (_req: Request, res:Response) => {
//     try {

//         return res.status(200).json( {success: true} );

//     } catch (error: any) {
//         return res.status(500).json({ success: false, message: error.message });
//     }
// }

const isAuthenticated = async (req: Request, res: Response) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(200).json({ success: false });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) throw new Error("JWT Secret not found");

    const tokenDecoded = jwt.verify(token, jwtSecret);

    if (
      typeof tokenDecoded === "object" &&
      tokenDecoded !== null &&
      "id" in tokenDecoded
    ) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(200).json({ success: false });
    }
  } catch (error: any) {
    return res.status(200).json({ success: false }); // don't crash frontend
  }
};

// controller function to send the password reset OTP
const sendResetOTP = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email)
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });

  try {
    const user = await userModel.findOne({ email });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOTP = otp;
    user.resetOTPExpireAt = Date.now() + 15 * 60 * 1000;
    await user.save();

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: user.email,
      subject: "Password reset OTP",
      text: `Your OTP for resetting your password is ${otp}. Use this OTP to proceed with resetting your password.`,
      html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>OTP Verification</title>
      <style>
        body { font-family: 'Segoe UI', sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); padding: 30px; }
        .header h1 { margin: 0; color: #2c3e50; font-size: 24px; text-align: center; }
        .content { text-align: center; padding: 20px 0; }
        .content p { font-size: 16px; color: #555; }
        .otp { font-size: 32px; letter-spacing: 12px; font-weight: bold; color: #27ae60; background: #ecf9f1; padding: 12px 24px; border-radius: 8px; display: inline-block; }
        .footer { font-size: 14px; color: #888; text-align: center; padding-top: 20px; border-top: 1px solid #eee; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header"><h1>MERN AUTH</h1></div>
        <div class="content">
          <p>Hi there,</p>
          <p>Use the following OTP to complete your password reset:</p>
          <div class="otp">${otp}</div>
          <p>This OTP is valid for 10 minutes.</p>
        </div>
        <div class="footer">
          If you didn’t request this, please ignore this email.<br/>
          &copy; 2025 MERN AUTH
        </div>
      </div>
    </body>
    </html>
  `,
    };

    await transporter.sendMail(mailOptions);

    return res
      .status(200)
      .json({ success: true, message: "OTP sent to your Email" });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Reset user password

const resetPassword = async (req: Request, res: Response) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword)
    return res.status(400).json({ success: false, message: "Missing details" });

  try {
    const user = await userModel.findOne({ email });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    if (user.resetOTP === "" || user.resetOTP !== otp)
      return res.status(404).json({ success: false, message: "Invalid OTP" });

    if (user.resetOTPExpireAt < Date.now())
      return res.status(400).json({ success: false, message: "OTP Expired" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOTP = "";
    user.resetOTPExpireAt = 0;
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export {
  register,
  login,
  logout,
  sendVerifyOTP,
  verifyEmail,
  isAuthenticated,
  sendResetOTP,
  resetPassword,
};

import { RequestHandler } from "express";
import userModel from "src/models/user.model";
import bcrypt from "bcryptjs";
import userProfileModel from "src/models/userProfile.model";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { JWT_SECRET } from "@config/index";
import { sendEMail } from "src/utils/sendEMail";

export const registerHandler: RequestHandler = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (user)
      return res
        .status(403)
        .json({ success: false, message: "User already registered." });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await userModel.create({
      email,
      password: hashedPassword
    });
    await userProfileModel.create({
      user: newUser._id,
      firstName,
      lastName
    });

    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
      expiresIn: "2m"
    });

    const testMessageUrl = await sendEMail({
      mailTo: email,
      subject: "Email for verification",
      html: `<h1>Hello ${firstName}, </h1> <p> please verify your email. <br/> this is verification token : ${token} </p>`
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully, Please verify your email.",
      testMessageUrl
    });
  } catch (error) {
    next(error);
  }
};

export const loginHandler: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "Wrong credantials." });
    if (!user.isVerified)
      return res
        .status(401)
        .json({ success: false, message: "Email not verified." });
    if (user.isBlocked)
      return res
        .status(401)
        .json({ success: false, message: "User is blocked." });
    if (user.isDeleted)
      return res
        .status(403)
        .json({ success: false, message: "This account is deleted." });

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched)
      return res
        .status(401)
        .json({ success: false, message: "Wrong credantials." });

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET);

    res
      .status(200)
      .json({ success: true, message: "User logged in successfully.", token });
  } catch (error) {
    next(error);
  }
};

export const verifyEmailHandler: RequestHandler = async (req, res, next) => {
  try {
    const { token } = req.body;
    const userInfo = jwt.verify(token, JWT_SECRET) as { userId: string };
    if (!userInfo)
      return res.status(403).json({
        success: false,
        message: "Token is invalid or expired."
      });
    const user = await userModel.findById(userInfo.userId);
    if (!user)
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    if (user.isVerified)
      return res.status(403).json({
        success: false,
        message: "User already verified."
      });
    user.isVerified = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: "User verified successfully."
    });
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      return res.status(403).json({
        success: false,
        message: "Token is invalid or expired."
      });
    }
    next(error);
  }
};

export const sendVerificationEmailHandler: RequestHandler = async (
  req,
  res,
  next
) => {
  const { email } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user)
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    if (user.isVerified)
      return res.status(403).json({
        success: false,
        message: "User already verified."
      });

    const userProfile = await userProfileModel.findOne({ user: user._id });
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "2m"
    });

    const testMessageUrl = await sendEMail({
      mailTo: email,
      subject: "Email for verification",
      html: `<h1>Hello ${userProfile?.firstName}, </h1> <p> please verify your email. <br/> this is verification token : ${token} </p>`
    });

    res.status(200).json({
      success: true,
      message: "Verification email sent successfully.",
      testMessageUrl
    });
  } catch (error) {
    next(error);
  }
};

export const sendForgetPasswordEmailHandler: RequestHandler = async (
  req,
  res,
  next
) => {
  const { email } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user)
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    if (!user.isVerified)
      return res.status(403).json({
        success: false,
        message: "User is not verified, please verify your email first."
      });

    const userProfile = await userProfileModel.findOne({ user: user._id });
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "2m"
    });

    const testMessageUrl = await sendEMail({
      mailTo: email,
      subject: "Email for Forget password",
      html: `<h1>Hello ${userProfile?.firstName}, </h1> <p> please click on the link below and forget your password. <br/> this is forget password token : ${token} </p>`
    });

    res.status(200).json({
      success: true,
      message: "Foget password email sent successfully.",
      testMessageUrl
    });
  } catch (error) {
    next(error);
  }
};

export const forgetPasswordHandler: RequestHandler = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const userInfo = jwt.verify(token, JWT_SECRET) as { userId: string };
    if (!userInfo)
      return res.status(403).json({
        success: false,
        message: "Token is invalid or expired."
      });
    const user = await userModel.findById(userInfo.userId);
    if (!user)
      return res.status(404).json({
        success: false,
        message: "User not found."
      });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password forgetted successfully."
    });
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      return res.status(403).json({
        success: false,
        message: "Token is invalid or expired."
      });
    }
    next(error);
  }
};

export const changePasswordHandler: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { password, newPassword } = req.body;
    const user = await userModel.findById(userId);
    if (!user)
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched)
      return res.status(403).json({
        success: false,
        message: "Please provide correct previous password."
      });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully."
    });
  } catch (error) {
    next(error);
  }
};

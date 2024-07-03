import { RequestHandler } from "express";
import userModel from "src/models/user.model";
import bcrypt from "bcryptjs";
import userProfileModel from "src/models/userProfile.model";
import jwt from "jsonwebtoken";
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

    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET);

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

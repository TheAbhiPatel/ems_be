import { RequestHandler } from "express";
import userModel from "src/models/user.model";
import bcrypt from "bcryptjs";
import userProfileModel from "src/models/userProfile.model";

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

    res
      .status(201)
      .json({ success: true, message: "User registered successfully." });
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
        .status(401)
        .json({ success: false, message: "This account is deleted." });

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (isPasswordMatched)
      return res
        .status(401)
        .json({ success: false, message: "Wrong credantials." });

    res
      .status(200)
      .json({ success: true, message: "User logged in successfully." });
  } catch (error) {
    next(error);
  }
};

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

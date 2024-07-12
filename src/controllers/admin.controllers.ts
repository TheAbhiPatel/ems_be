import { RequestHandler } from "express";
import companyProfileModel from "src/models/companyProfile.model";
import employeeModel from "src/models/employee.model";
import userModel from "src/models/user.model";
import userProfileModel from "src/models/userProfile.model";
import bcrypt from "bcryptjs";

export const completeCompanyProfileHandler: RequestHandler = async (
  req,
  res,
  next
) => {
  const { companyName, mobile, address, subscription, subscriptionType } =
    req.body;

  try {
    const userId = req.user.userId;
    const user = await userModel.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
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

    const isCompanyProfileExists = await companyProfileModel.findOne({
      admin: userId
    });

    if (isCompanyProfileExists)
      return res
        .status(403)
        .json({ success: false, message: "Company profile already exists." });

    const profile = await userProfileModel.findOne({ user: userId });
    if (!profile)
      return res
        .status(404)
        .json({ success: false, message: "Profile not found." });
    profile.address = address;
    profile.mobile = mobile;
    await profile.save();

    const now = new Date();
    const oneMonthFromNow = new Date(now).setMonth(now.getMonth() + 1);

    await companyProfileModel.create({
      admin: userId,
      companyName,
      mobile,
      address,
      email: user.email,
      subscription,
      subscriptionType,
      subscriptionStartDate: now,
      subscriptionEndDate: oneMonthFromNow
    });

    res.status(200).json({
      success: true,
      message: "Company profile successfully created."
    });
  } catch (error) {
    next(error);
  }
};

export const addEmployeeHandler: RequestHandler = async (req, res, next) => {
  try {
    const createdBy = req.user.userId;

    const createdByProfile = await userProfileModel.findOne({
      user: createdBy
    });
    if (!createdByProfile)
      return res
        .status(404)
        .json({ success: false, message: "Created by profile not found." });

    const { firstName, lastName, email, password } = req.body;
    const { position, department, dateOfJoining, salary } = req.body;

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
    const userProfile = await userProfileModel.create({
      user: newUser._id,
      firstName,
      lastName
    });

    await employeeModel.create({
      user: newUser._id,
      userProfile: userProfile._id,
      company: createdByProfile.company,
      createdBy,
      position,
      department,
      dateOfJoining,
      salary
    });

    res.status(200).json({
      success: true,
      message: "Employee profile created successfully."
    });
  } catch (error) {
    next(error);
  }
};

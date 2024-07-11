import { RequestHandler } from "express";
import attendanceModel from "src/models/attendance.model";
import companyProfileModel from "src/models/companyProfile.model";
import userModel from "src/models/user.model";
import userProfileModel from "src/models/userProfile.model";

export const completeCompanyProfileHandler: RequestHandler = async (
  req,
  res,
  next
) => {
  const {
    companyName,
    mobile,
    address,
    subscription,
    subscriptionType,
    subscriptionStartDate,
    subscriptionEndDate
  } = req.body;

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

    const profile = await userProfileModel.findOne({ user: userId });
    if (!profile)
      return res
        .status(404)
        .json({ success: false, message: "Profile not found." });
    profile.address = address;
    profile.mobile = mobile;
    await profile.save();

    await companyProfileModel.create({
      companyName,
      mobile,
      address,
      email: user.email,
      subscription,
      subscriptionType,
      subscriptionStartDate,
      subscriptionEndDate
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
    const userId = req.user.userId;

    // const attendance = await attendanceModel.findOne({ user: userId });

    await attendanceModel.create({
      user: userId,
      inTime: new Date()
    });

    res.status(200).json({
      success: true,
      message: "You are successfully punched in."
    });
  } catch (error) {
    next(error);
  }
};

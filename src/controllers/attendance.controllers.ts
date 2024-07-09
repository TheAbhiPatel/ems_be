import { RequestHandler } from "express";
import attendanceModel from "src/models/attendance.model";

export const punchInHandler: RequestHandler = async (req, res, next) => {
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

import { RequestHandler } from "express";

export const loginHandler: RequestHandler = (req, res, next) => {
  try {
    res.status(200).json({ success: true, message: "Welcome to login route" });
  } catch (error) {
    next(error);
  }
};

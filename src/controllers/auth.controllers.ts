import { RequestHandler } from "express";

export const loginHandler: RequestHandler = (req, res) => {
  try {
    res.status(200).json({ success: true, message: "Welcome to login route" });
  } catch (error) {
    console.log(error);
  }
};

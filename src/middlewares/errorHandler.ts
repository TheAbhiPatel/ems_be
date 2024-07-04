import { ErrorRequestHandler } from "express";
import { errorLog } from "src/utils/colorLogs";
import colors from "colors";

/* eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars */
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  try {
    console.log(colors.blue("--------------> catched Error <----------------"));
    errorLog(err);
    console.log(
      colors.blue("--------------> catched Error End! <----------------")
    );
    res.status(500).json({ success: false, message: "Something went wrong." });
  } catch (error) {
    errorLog(error);
    res.status(500).json({ success: false, message: "Something went wrong." });
  }
};

import { punchInHandler } from "@cont/attendance.controllers";
import { Router } from "express";

const attendanceRouter = Router();

attendanceRouter.post("/punch-in", punchInHandler);

export default attendanceRouter;

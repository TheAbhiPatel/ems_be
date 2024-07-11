import { Router } from "express";
import authRouter from "./auth.routes";
import attendanceRouter from "./attendance.routes";
import { authorize } from "src/middlewares/authorize";
import { ERoles } from "src/models/user.model";
import subscriptionRouter from "./subscriptionPlan.routes ";

const router = Router();

router.use("/auth", authRouter);
router.use("/subscriptions", subscriptionRouter);
router.use(
  "/attendance",
  authorize([ERoles.ADMIN, ERoles.MANAGER, ERoles.EMPLOYEE]),
  attendanceRouter
);

export default router;

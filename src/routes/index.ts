import { Router } from "express";
import authRouter from "./auth.routes";
import attendanceRouter from "./attendance.routes";
import { authorize } from "src/middlewares/authorize";
import { ERoles } from "src/models/user.model";
import subscriptionRouter from "./subscriptionPlan.routes ";
import adminRouter from "./admin.routes";

const router = Router();

router.use("/auth", authRouter);
router.use(
  "/subscriptions",
  authorize([ERoles.SUPER_ADMIN]),
  subscriptionRouter
);
router.use("/admin", adminRouter);
router.use(
  "/attendance",
  authorize([ERoles.ADMIN, ERoles.MANAGER, ERoles.EMPLOYEE]),
  attendanceRouter
);

export default router;

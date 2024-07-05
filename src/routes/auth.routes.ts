import {
  changePasswordHandler,
  forgetPasswordHandler,
  loginHandler,
  registerHandler,
  sendForgetPasswordEmailHandler,
  sendVerificationEmailHandler,
  verifyEmailHandler
} from "@cont/auth.controllers";
import { Router } from "express";

const authRouter = Router();

authRouter.post("/register", registerHandler);
authRouter.post("/login", loginHandler);
authRouter.post("/verify-email", verifyEmailHandler);
authRouter.post("/send-verification-email", sendVerificationEmailHandler);
authRouter.post("/send-forget-password-email", sendForgetPasswordEmailHandler);
authRouter.post("/forget-password", forgetPasswordHandler);
authRouter.post("/change-password", changePasswordHandler);

export default authRouter;

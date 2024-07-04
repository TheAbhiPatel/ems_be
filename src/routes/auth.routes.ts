import {
  loginHandler,
  registerHandler,
  sendVerificationEmailHandler,
  verifyEmailHandler
} from "@cont/auth.controllers";
import { Router } from "express";

const authRouter = Router();

authRouter.post("/register", registerHandler);
authRouter.post("/login", loginHandler);
authRouter.post("/verify-email", verifyEmailHandler);
authRouter.post("/send-verification-email", sendVerificationEmailHandler);

export default authRouter;

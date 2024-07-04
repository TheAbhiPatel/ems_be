import {
  loginHandler,
  registerHandler,
  verifyEmailHandler
} from "@cont/auth.controllers";
import { Router } from "express";

const authRouter = Router();

authRouter.post("/register", registerHandler);
authRouter.post("/login", loginHandler);
authRouter.post("/verify-email", verifyEmailHandler);

export default authRouter;

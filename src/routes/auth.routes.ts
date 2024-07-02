import { loginHandler, registerHandler } from "@cont/auth.controllers";
import { Router } from "express";

const authRouter = Router();

authRouter.post("/register", registerHandler);
authRouter.post("/login", loginHandler);

export default authRouter;

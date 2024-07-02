import { registerHandler } from "@cont/auth.controllers";
import { Router } from "express";

const authRouter = Router();

authRouter.post("/register", registerHandler);

export default authRouter;

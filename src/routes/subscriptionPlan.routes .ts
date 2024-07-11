import { createSubscriptionPlanHandler } from "@cont/subscriptionPlan.controllers";
import { Router } from "express";

const subscriptionRouter = Router();

subscriptionRouter.post("/create", createSubscriptionPlanHandler);

export default subscriptionRouter;

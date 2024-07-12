import {
  createSubscriptionPlanHandler,
  getAllSubscriptionPlanHandler
} from "@cont/subscriptionPlan.controllers";
import { Router } from "express";

const subscriptionRouter = Router();

subscriptionRouter.post("/create", createSubscriptionPlanHandler);
subscriptionRouter.get("/", getAllSubscriptionPlanHandler);

export default subscriptionRouter;

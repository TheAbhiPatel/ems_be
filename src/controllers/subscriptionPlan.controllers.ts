import { RequestHandler } from "express";
import subscriptionPlanModel from "src/models/subscriptionPlan.model";

export const createSubscriptionPlanHandler: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const userId = req.user.userId;
    const { name, description, monthlyPrice, yearlyPrice, features } = req.body;

    const isPlanExist = await subscriptionPlanModel.findOne({ name });
    if (isPlanExist)
      return res.status(403).json({
        success: false,
        message: "Subscription plan name already exists."
      });

    await subscriptionPlanModel.create({
      createdBy: userId,
      name,
      description,
      monthlyPrice,
      yearlyPrice,
      features
    });

    res.status(200).json({
      success: true,
      message: "Subscription plan successfully created."
    });
  } catch (error) {
    next(error);
  }
};

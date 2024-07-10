import { Document, Schema, model } from "mongoose";

interface IBaseSubscriptionPlan {
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
}

interface ISubscriptionPlanSchema extends Document, IBaseSubscriptionPlan {}

const subscriptionPlanSchema = new Schema<ISubscriptionPlanSchema>(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      required: true
    },
    monthlyPrice: {
      type: Number,
      required: true
    },
    yearlyPrice: {
      type: Number,
      required: true
    },
    features: {
      type: [String],
      required: true
    }
  },
  { timestamps: true }
);

const subscriptionPlanModel = model<ISubscriptionPlanSchema>(
  "subscriptionPlan",
  subscriptionPlanSchema
);
export default subscriptionPlanModel;

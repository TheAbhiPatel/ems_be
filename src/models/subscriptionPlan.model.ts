import { Document, Schema, model } from "mongoose";

interface IBaseSubscriptionPlan {
  createdBy: Schema.Types.ObjectId;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
}

interface ISubscriptionPlanSchema extends Document, IBaseSubscriptionPlan {}

const subscriptionPlanSchema = new Schema<ISubscriptionPlanSchema>(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true
    },
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

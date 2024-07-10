import { Document, Schema, model } from "mongoose";
import { addressSchema } from "./userProfile.model";

/* eslint-disable no-unused-vars */
export enum ESubType {
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY"
}
/* eslint-enable no-unused-vars */

interface IBaseCompanyProfile {
  admin: Schema.Types.ObjectId;
  companyName: string;
  email: string;
  mobile: string;
  address: typeof addressSchema;
  subscription: Schema.Types.ObjectId;
  subscriptionType: ESubType;
  subscriptionStartDate: Date;
  subscriptionEndDate: Date;
  isDeleted: boolean;
}

interface ICompanyProfileSchema extends Document, IBaseCompanyProfile {}

const companyProfileSchema = new Schema<ICompanyProfileSchema>(
  {
    admin: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      index: true
    },
    companyName: {
      type: String,
      required: true
    },
    email: {
      type: String
    },
    mobile: {
      type: String
    },
    address: addressSchema,
    subscription: {
      type: Schema.Types.ObjectId,
      ref: "subscriptionPlan",
      required: true
    },
    subscriptionType: {
      type: String,
      enum: ESubType,
      default: ESubType.MONTHLY
    },
    subscriptionStartDate: {
      type: Date,
      required: true
    },
    subscriptionEndDate: {
      type: Date,
      required: true
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const companyProfileModel = model<ICompanyProfileSchema>(
  "companyProfile",
  companyProfileSchema
);
export default companyProfileModel;

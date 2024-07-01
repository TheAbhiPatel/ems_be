import { Document, Schema, model } from "mongoose";

/* eslint-disable no-unused-vars */
export enum EGender {
  MALE = "Male",
  FEMALE = "Female",
  OTHER = "Other"
}
/* eslint-enable no-unused-vars */

interface IBaseAddress {
  line1: string;
  line2: string;
  city: string;
  state: string;
  country: string;
  zip: number;
}

interface IBaseUserProfile {
  user: Schema.Types.ObjectId;
  firstName: string;
  lastName: string;
  gender: EGender;
  mobile: string;
  profilePic: string;
  address: IBaseAddress;
  isDeleted: boolean;
}
interface IAddressSchema extends Document, IBaseAddress {}
interface IUserProfileSchema extends Document, IBaseUserProfile {}

const addressSchema = new Schema<IAddressSchema>({
  line1: {
    type: String
  },
  line2: {
    type: String
  },
  city: {
    type: String
  },
  state: {
    type: String
  },
  country: {
    type: String
  },
  zip: {
    type: Number
  }
});

const userProfileSchema = new Schema<IUserProfileSchema>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      index: true
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    gender: {
      type: String,
      enum: EGender
    },
    mobile: {
      type: String
    },
    profilePic: {
      type: String
    },
    address: addressSchema,
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const userProfileModel = model<IUserProfileSchema>(
  "userProfile",
  userProfileSchema
);
export default userProfileModel;

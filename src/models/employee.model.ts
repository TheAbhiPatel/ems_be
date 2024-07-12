import { Document, Schema, model } from "mongoose";

interface IBaseEmployee {
  user: Schema.Types.ObjectId;
  userProfile: Schema.Types.ObjectId;
  company: Schema.Types.ObjectId;
  createdBy: Schema.Types.ObjectId;
  position: string;
  department: string;
  dateOfJoining: Date;
  salary: number;
  isDeleted: boolean;
}

interface IEmployeeSchema extends Document, IBaseEmployee {}

const employeeSchema = new Schema<IEmployeeSchema>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      index: true
    },
    userProfile: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true
    },
    company: {
      type: Schema.Types.ObjectId,
      required: true
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true
    },
    position: {
      type: String,
      required: true
    },
    department: {
      type: String,
      required: true
    },
    salary: {
      type: Number,
      required: true
    },
    dateOfJoining: {
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

const employeeModel = model<IEmployeeSchema>("employee", employeeSchema);
export default employeeModel;

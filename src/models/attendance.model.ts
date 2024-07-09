import { Document, Schema, model } from "mongoose";

interface IBaseAttendance {
  user: Schema.Types.ObjectId;
  inTime: Date;
  outTime: Date;
}

interface IAttendanceSchema extends Document, IBaseAttendance {}

const attendanceSchema = new Schema<IAttendanceSchema>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "user",
      index: true
    },
    inTime: {
      type: Date,
      required: true
    },
    outTime: {
      type: Date
    }
  },
  { timestamps: true }
);

const attendanceModel = model<IAttendanceSchema>(
  "attendance",
  attendanceSchema
);
export default attendanceModel;

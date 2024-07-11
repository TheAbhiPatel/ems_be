import {
  addEmployeeHandler,
  completeCompanyProfileHandler
} from "@cont/admin.controllers";
import { Router } from "express";

const adminRouter = Router();

adminRouter.post("/complete-company-profile", completeCompanyProfileHandler);
adminRouter.post("/add-employee", addEmployeeHandler);

export default adminRouter;

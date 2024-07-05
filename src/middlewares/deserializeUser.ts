import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@config/index";
import userModel, { ERoles } from "src/models/user.model";

/** ---> Modifing request type and added user */
/* eslint-disable */
declare global {
  namespace Express {
    interface Request {
      user: {
        userId: string;
        role: ERoles;
      };
    }
  }
}
/* eslint-enable */

export const deserializeUser: RequestHandler = async (req, res, next) => {
  try {
    const header = req.headers["authorization"];
    if (header) {
      const [bearer, token] = header.split(" ");
      if (bearer === "Bearer") {
        const userInfo = jwt.verify(token, JWT_SECRET) as {
          userId: string;
          role: ERoles;
        };
        if (userInfo) {
          const user = await userModel.findById(userInfo.userId);
          if (user && !user.isBlocked) {
            req.user.userId = userInfo.userId;
            req.user.role = user.role;
          }
        }
      }
    }

    next();
  } catch (error) {
    console.log("deserialize middleware error : ", error);
    next();
  }
};

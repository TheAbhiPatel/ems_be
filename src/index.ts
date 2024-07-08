import express from "express";
import { blueLog } from "./utils/colorLogs";
import router from "./routes";
import { errorHandler } from "./middlewares/errorHandler";
import { HOST_NAME, MONGO_DB_URL, PORT } from "./config";
import { connectDb } from "./utils/connectDb";
import cors from "cors";
import helmet from "helmet";
import { deserializeUser } from "./middlewares/deserializeUser";

const app = express();

/** ---> Registering middlewares */
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

/** ---> Registering custom middlewares */
app.use(deserializeUser);

app.get("/", function (req, res) {
  res
    .status(200)
    .json({ success: true, message: "Welcome to the EMS System." });
});

/** ---> Handling all application's routes */
app.use("/api/v1", router);

/** ---> Handling not found (404) routes */
app.use("*", (req, res) => {
  res.status(404).json({ success: false, message: "Route not found." });
});

/** ---> Handling global errors */
app.use(errorHandler);

app.listen(Number(PORT), HOST_NAME, () => {
  blueLog(`[::] Server is running at http://${HOST_NAME}:${PORT}`);
  connectDb(MONGO_DB_URL);
});

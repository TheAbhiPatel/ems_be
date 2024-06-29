import express from "express";
import { blueLog } from "./utils/colorLogs";
import router from "./routes";

const app = express();

/** ---> Registering middlewares */
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

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

app.listen(3331, () => {
  blueLog(`[::] Server is running at http://localhost:3331`);
});

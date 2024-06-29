import express from "express";
import { blueLog } from "./utils/colorLogs";
import router from "./routes";

const app = express();

app.get("/", function (req, res) {
  res
    .status(200)
    .json({ success: true, message: "Welcome to the EMS System." });
});

app.use("/api/v1", router);

app.listen(3331, () => {
  blueLog(`[::] Server is running at http://localhost:3331`);
});

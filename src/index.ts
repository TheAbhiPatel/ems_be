import express from "express";
const app = express();

app.get("/", function (req, res) {
  res
    .status(200)
    .json({ success: true, message: "Welcome to the EMS System." });
});

app.listen(3331, () => {
  console.log(`[::] Server is running at http://localhost:3331`);
});

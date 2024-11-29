require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const habitRoutes = require("./routes/habitRoutes");
const userRoutes = require("./routes/userRoutes");
const weekRoutes = require("./routes/weekRoutes");
const apiRoutes = require("./routes/apiRoutes");

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  })
);

app.use("/api/accounts", userRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/weeks", weekRoutes);
app.use("/api/external", apiRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then((res) => app.listen(4000, () => console.log(`Listening on port 4000`)))
  .catch((err) => console.log(err));

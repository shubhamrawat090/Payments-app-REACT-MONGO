const express = require("express");
const mongoose = require("mongoose");
const routeRouter = require("./routes/index");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());

app.use(express.json());

// All "/api/v1" routes mapped to the rootRouter
app.use("/api/v1", routeRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log("Listening at PORT: 3000");
});

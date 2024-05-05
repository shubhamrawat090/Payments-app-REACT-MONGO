async function main() {
  const express = require("express");
  const routeRouter = require("./routes/index");
  const cors = require("cors");
  require("dotenv").config();
  const mongoose = require("mongoose");

  const app = express();

  app.use(cors());

  app.use(express.json());

  // Connect to the DB
  // NOTE: Should be done before route imports as it runs findOne before connecting(due to some optimisation in MONGODB) and would result in bufferTimeout error otherwise.
  await mongoose.connect("mongodb://127.0.0.1:27017/payApp");

  // All "/api/v1" routes mapped to the rootRouter
  app.use("/api/v1", routeRouter);

  app.listen(process.env.PORT || 3000, () => {
    console.log("Listening at PORT: 3000");
  });
}
main();

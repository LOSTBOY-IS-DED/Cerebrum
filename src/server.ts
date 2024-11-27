require("dotenv").config();
const express = require("express");
const { Users } = require("./model/Schema");
const mongoose = require("mongoose");
const { userRouter } = require("./routes/userRoutes");

const app = express();

app.use(express.json());

app.use("/user", userRouter);

async function connectionDb() {
  await mongoose
    .connect(process.env.DB_URL)
    .then(() => console.log("Connected to database!"))
    .catch((error: any) => {
      console.log(error);
    });

  app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
  });
}

connectionDb();

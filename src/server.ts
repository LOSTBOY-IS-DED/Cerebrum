require("dotenv").config();
import express from "express";
import mongoose from "mongoose";
import { userRouter } from "./routes/userRoutes";
import { brainRouter } from "./routes/brainRoutes";
import { contentRouter } from "./routes/contentRouter";

const app = express();

app.use(express.json());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/content", contentRouter);
app.use("/api/v1/brain", brainRouter);

async function connectionDb() {
  await mongoose
    .connect(`${process.env.DB_URL}`)
    .then(() => console.log("Connected to database!"))
    .catch((error: any) => {
      console.log(error);
    });

  app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
  });
}

connectionDb();

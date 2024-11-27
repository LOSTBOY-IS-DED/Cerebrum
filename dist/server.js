"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
require("dotenv").config();
const express = require("express");
const { Users } = require("./model/Schema");
const mongoose = require("mongoose");
const { userRouter } = require("./routes/userRoutes");
const app = express();
app.use(express.json());
app.use("/user", userRouter);
function connectionDb() {
    return __awaiter(this, void 0, void 0, function* () {
        yield mongoose
            .connect(process.env.DB_URL)
            .then(() => console.log("Connected to database!"))
            .catch((error) => {
            console.log(error);
        });
        app.listen(process.env.PORT, () => {
            console.log(`Server started on port ${process.env.PORT}`);
        });
    });
}
connectionDb();

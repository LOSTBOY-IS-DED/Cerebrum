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
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express = require("express");
const Schema_1 = require("../model/Schema");
const bcrypt = require("bcrypt");
const zod_1 = require("zod");
const UserSchema = zod_1.z.object({
    username: zod_1.z
        .string()
        .min(3, "Username must have atleast 3 characters")
        .max(10, "Username should not have more than 10 characters"),
    password: zod_1.z
        .string()
        .min(8, "password length should be 8 minimum")
        .max(20, "password length should be 20 maximum "),
});
const userRouter = express.Router();
exports.userRouter = userRouter;
userRouter.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsedData = UserSchema.safeParse(req.body);
        if (!parsedData.success) {
            return res.status(400).json({
                success: false,
                message: "Validation Failed!!!",
                errors: parsedData.error.errors,
            });
        }
        const { username, password } = parsedData.data;
        const existingUser = yield Schema_1.Users.findOne({ username });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: " User Already exists try again with a different username",
            });
        }
        else {
            const hashPassword = yield bcrypt.hash(password, 10);
            const newUser = new Schema_1.Users({
                username,
                password: hashPassword,
            });
            yield newUser.save();
            return res.status(200).json({
                success: true,
                message: "Signed in successfully!!!",
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error occurred during sign-in",
        });
    }
}));

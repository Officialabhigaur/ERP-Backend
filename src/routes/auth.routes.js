import { Router } from "express";
import {catchAsync} from "../middlewares/index.js"
import {  login, registerUser } from "../controllers/index.js";

export const authRoutes = Router();


authRoutes.post("/login", catchAsync(login));
authRoutes.post("/register", catchAsync(registerUser));

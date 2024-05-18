import express from "express";
import {
  createUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateUserSubscription,
} from "../controllers/usersControllers.js";
import { auth } from "../auth.js";

const usersRouter = express.Router();

usersRouter.post("/register", createUser);
usersRouter.post("/login", loginUser);
usersRouter.post("/logout", auth, logoutUser);
usersRouter.get("/current", auth, getCurrentUser);
usersRouter.patch("/", auth, updateUserSubscription);

export default usersRouter;

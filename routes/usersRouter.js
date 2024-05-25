import express from "express";
import multer from "multer";
import {
  createUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateUserSubscription,
  uploadAvatar,
} from "../controllers/usersControllers.js";
import { auth } from "../auth.js";

const maxFileSize = 10000000;
const upload = multer({ dest: "/tmp", limits: { fileSize: maxFileSize } });

const usersRouter = express.Router();
usersRouter.post("/login", loginUser);
usersRouter.post("/register", createUser);
usersRouter.post("/logout", auth, logoutUser);
usersRouter.get("/current", auth, getCurrentUser);
usersRouter.patch("/", auth, updateUserSubscription);
usersRouter.patch("/avatars", auth, upload.single("avatar"), uploadAvatar);

export default usersRouter;

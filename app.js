import express from "express";
import "./passport.js";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import fs from "fs/promises";
import path from "path";
import "dotenv/config";
import { MulterError } from "multer";
mongoose.Promise = global.Promise;

import contactsRouter from "./routes/contactsRouter.js";
import usersRouter from "./routes/usersRouter.js";
import { auth } from "./auth.js";

export const uploadDirPath = path.join(process.cwd(), "tmp");
export const storeImagePath = path.join(process.cwd(), "public", "avatars");

const isAccessible = async (imageFolder) =>
  fs
    .access(imageFolder)
    .then(() => true)
    .catch(() => false);

const createFolderIsNotExist = async (folder) => {
  if (!(await isAccessible(folder))) {
    await fs.mkdir(folder);
  }
};

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/contacts", auth, contactsRouter);
app.use("/api/users", usersRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  if (err instanceof MulterError) {
    res.statusCode = 400;
  }

  if (res.statusCode === 200) res.statusCode = 500;
  res.status(res.statusCode).json({ message: err.message });
});

const PORT = process.env.PORT || 3000;
const uri = process.env.DB_CONNECTION_STRING;

const connection = mongoose.connect(uri, {
  autoIndex: true,
  dbName: "db-contacts",
});

connection
  .then(() => {
    console.log("Database connection successful");
    app.listen(PORT, async () => {
      await createFolderIsNotExist(uploadDirPath);
      await createFolderIsNotExist(storeImagePath);
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`Server not running. Error message: ${err.message}`);
    process.exit(1);
  });

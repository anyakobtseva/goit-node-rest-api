import mongoose from "mongoose";
import fs from "fs/promises";
import app from "./app.js";
mongoose.Promise = global.Promise;

import { uploadDirPath, storeImagePath } from "./config.js";

const PORT = process.env.PORT || 3000;
const uri = process.env.DB_CONNECTION_STRING;

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
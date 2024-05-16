import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import 'dotenv/config';
mongoose.Promise = global.Promise;

import contactsRouter from "./routes/contactsRouter.js";

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
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
    app.listen(PORT, function () {
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`Server not running. Error message: ${err.message}`);
    process.exit(1);
  });

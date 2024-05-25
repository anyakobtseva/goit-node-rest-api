import express from "express";
import "./passport.js";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";
import { MulterError } from "multer";
import contactsRouter from "./routes/contactsRouter.js";
import usersRouter from "./routes/usersRouter.js";
import { auth } from "./auth.js";

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

export default app;
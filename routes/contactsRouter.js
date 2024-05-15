import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from "../controllers/contactsControllers.js";
import { isValidObjectId } from "mongoose";

const contactsRouter = express.Router();

contactsRouter.use("/:id", (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    res.status(400);
    next(new Error("Invalid Id"));
  }
  next('route');
})

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", getOneContact);

contactsRouter.delete("/:id", deleteContact);

contactsRouter.post("/", createContact);

contactsRouter.put("/:id", updateContact);

contactsRouter.patch("/:id/favorite", updateStatusContact);

export default contactsRouter;

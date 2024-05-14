import { Contacts } from "../db/contactsDb.js";
import { isValidObjectId } from "mongoose";

async function listContacts() {
  return Contacts.find(null, { __v: 0 });
}

async function getContactById(contactId) {
  if (!isValidObjectId(contactId)) throw Error("Invalid id");
  return Contacts.findOne({ _id: contactId });
}

async function removeContact(contactId) {
  if (!isValidObjectId(contactId)) throw Error("Invalid id");
  return Contacts.findByIdAndDelete({ _id: contactId });
}

async function addContact(name, email, phone) {
  return Contacts.create({ name, email, phone, favorite: false });
}

async function updateContact(contactId, newData) {
  if (!isValidObjectId(contactId)) throw Error("Invalid id");
  return Contacts.findByIdAndUpdate({ _id: contactId }, { ...newData });
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};

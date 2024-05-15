import { Contacts } from "../db/contactsDb.js";

async function listContacts() {
  return Contacts.find(null, { __v: 0 });
}

async function getContactById(contactId) {
  return Contacts.findOne({ _id: contactId });
}

async function removeContact(contactId) {
  return Contacts.findByIdAndDelete({ _id: contactId });
}

async function addContact(name, email, phone) {
  return Contacts.create({ name, email, phone, favorite: false });
}

async function updateContact(contactId, newData) {
  return Contacts.findByIdAndUpdate({ _id: contactId }, { ...newData }, { new: true });
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};

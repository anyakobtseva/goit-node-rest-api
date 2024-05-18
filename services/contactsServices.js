import { Contacts } from "../db/contacts.js";

async function listContacts(filter) {
  return Contacts.find(filter, { __v: 0 });
}

async function getContactById(contactId, owner) {
  return Contacts.findOne({ _id: contactId, owner });
}

async function removeContact(contactId, owner) {
  return Contacts.findOneAndDelete({ _id: contactId, owner });
}

async function addContact(name, email, phone, owner) {
  return Contacts.create({ name, email, phone, favorite: false, owner });
}

async function updateContact(contactId, owner, newData) {
  return Contacts.findOneAndUpdate(
    { _id: contactId, owner },
    { ...newData },
    { new: true }
  );
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};

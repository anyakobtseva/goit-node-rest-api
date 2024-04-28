import * as fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const contactsPath = path.resolve("db", "contacts.json");

async function listContacts() {
  const contacts = await fs.readFile(contactsPath, { encoding: "utf-8" });
  return JSON.parse(contacts);
}

async function getContactById(contactId) {
  const contacts = await listContacts();
  const contact = contacts.find((contact) => contact.id === contactId);
  if (typeof contact === "undefined") {
    return null;
  }
  return contact;
}

async function removeContact(contactId) {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) {
    return null;
  }

  const removeContact = contacts[index];
  contacts.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, undefined, 2));
  return removeContact;
}

async function addContact(name, email, phone) {
  const contact = { name, email, phone, id: crypto.randomUUID() };
  const contacts = await listContacts();
  contacts.push(contact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, undefined, 2));

  return contact;
}

async function updateContact(contact, newData) {
  Object.assign(contact, { ...newData });
  const contacts = await listContacts();
  const index = contacts.findIndex((c) => c.id === contact.id);
  contacts.splice(index, 1, contact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, undefined, 2));

  return contact;
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};

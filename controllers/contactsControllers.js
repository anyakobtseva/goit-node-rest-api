import contactsService from "../services/contactsServices.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";

export const getAllContacts = async (_, res) => {
  res.status(200).send(await contactsService.listContacts());
};

export const getOneContact = async (req, res) => {
  const contact = await contactsService.getContactById(req.params.id);
  contact ? res.status(200).send(contact) : res.status(404).send("Not found");
};

export const deleteContact = async (req, res) => {
  const contact = await contactsService.removeContact(req.params.id);
  contact ? res.status(200).send(contact) : res.status(404).send("Not found");
};

export const createContact = async (req, res) => {
  const { error, value } = createContactSchema.validate(req.body);

  if (error) return res.status(400).send(error.message);
  const contact = await contactsService.addContact(
    value.name,
    value.email,
    value.phone
  );
  res.status(201).send(contact);
};

export const updateContact = async (req, res) => {
  let contact = await contactsService.getContactById(req.params.id);
  if (!contact) return res.status(404).send("Not found");
  const { error, value } = updateContactSchema.validate(req.body);
  if (error) return res.status(400).send("Body must have at least one field");
  contact = await contactsService.updateContact(contact, value);
  res.status(200).send(contact);
};

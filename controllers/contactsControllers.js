import contactsService from "../services/contactsServices.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";

const errorFn = (message) => {
  return { message };
};

export const getAllContacts = async (_, res) => {
  res.status(200).send(await contactsService.listContacts());
};

export const getOneContact = async (req, res) => {
  const contact = await contactsService.getContactById(req.params.id);
  contact
    ? res.status(200).send(contact)
    : res.status(404).send(errorFn("Not found"));
};

export const deleteContact = async (req, res) => {
  const contact = await contactsService.removeContact(req.params.id);
  contact
    ? res.status(200).send(contact)
    : res.status(404).send(errorFn("Not found"));
};

export const createContact = async (req, res) => {
  const { error, value } = createContactSchema.validate(req.body);

  if (error) return res.status(400).send(errorFn(error.message));
  const contact = await contactsService.addContact(
    value.name,
    value.email,
    value.phone
  );
  res.status(201).send(contact);
};

export const updateContact = async (req, res) => {
  let contact = await contactsService.getContactById(req.params.id);
  if (!contact) return res.status(404).send(errorFn("Not found"));
  if (typeof req.body === "object" && Object.keys(req.body).length === 0)
    return res.status(400).send(errorFn("Body must have at least one field"));
  const { error, value } = updateContactSchema.validate(req.body);
  if (error) return res.status(400).send(errorFn(error.message));
  contact = await contactsService.updateContact(contact, value);
  res.status(200).send(contact);
};

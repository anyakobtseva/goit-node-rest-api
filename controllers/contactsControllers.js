import contactsService from "../services/contactsServices.js";
import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteContactSchema
} from "../schemas/contactsSchemas.js";

const errorFn = (message) => {
  return { message };
};

export const getAllContacts = async (_, res) => {
  res.status(200).send(await contactsService.listContacts());
};

export const getOneContact = async (req, res) => {
  try {
    const contact = await contactsService.getContactById(req.params.id);
    if (!contact) throw Error("Not found");
    res.status(200).send(contact);
  } catch (error) {
    res.status(404).send(errorFn("Not found"));
  }
};

export const deleteContact = async (req, res) => {
  try {
    const contact = await contactsService.removeContact(req.params.id);
    if (!contact) throw Error("Not found");
    res.status(200).send(contact);
  } catch (error) {
    res.status(404).send(errorFn("Not found"));
  }
};

export const createContact = async (req, res) => {
  const { error, value } = createContactSchema.validate(req.body);

  if (error) return res.status(400).send(errorFn(error.message));
  try {
    const contact = await contactsService.addContact(
      value.name,
      value.email,
      value.phone
    );
    res.status(201).send(contact);
  } catch (error) {
    res.status(400).send(errorFn(error));
  }
};

export const updateContact = async (req, res) => {
  const { error, value } = updateContactSchema.validate(req.body);

  if (error) return res.status(400).send(errorFn(error.message));
  try {
    const contact = await contactsService.updateContact(req.params.id, {
      name: value.name,
      email: value.email,
      phone: value.phone,
    });
    if (!contact) throw Error("Not found");
    res.status(200).send(contact);
  } catch (error) {
    if (error.message === "Not found")
      return res.status(404).send(errorFn("Not found"));
    res.status(400).send(errorFn(error.message));
  }
};

export const updateStatusContact = async (req, res) => {
  const { error, value } = updateFavoriteContactSchema.validate(req.body);

  if (error) return res.status(400).send(errorFn(error.message));
  try {
    const contact = await contactsService.updateContact(req.params.id, {
      favorite: value.favorite,
    });
    if (!contact) throw Error("Not found");
    res.status(200).send(contact);
  } catch (error) {
    if (error.message === "Not found")
      return res.status(404).send(errorFn("Not found"));
    res.status(400).send(errorFn(error.message));
  }
};

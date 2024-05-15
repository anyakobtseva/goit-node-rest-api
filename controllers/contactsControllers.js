import contactsService from "../services/contactsServices.js";
import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteContactSchema,
} from "../schemas/contactsSchemas.js";

export const getAllContacts = async (_, res) => {
  res.status(200).send(await contactsService.listContacts());
};

export const getOneContact = async (req, res, next) => {
  try {
    const contact = await contactsService.getContactById(req.params.id);
    if (!contact) throw Error("Not found");
    res.status(200).send(contact);
  } catch (error) {
    res.status(404);
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const contact = await contactsService.removeContact(req.params.id);
    if (!contact) throw Error("Not found");
    res.status(200).send(contact);
  } catch (error) {
    res.status(404);
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { error, value } = createContactSchema.validate(req.body);
    if (error) throw Error(error);
    const contact = await contactsService.addContact(
      value.name,
      value.email,
      value.phone
    );
    res.status(201).send(contact);
  } catch (error) {
    res.status(400);
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { error, value } = updateContactSchema.validate(req.body);
    if (error) throw Error(error);
    const contact = await contactsService.updateContact(req.params.id, {
      name: value.name,
      email: value.email,
      phone: value.phone,
    });
    if (!contact) throw Error("Not found");
    res.status(200).send(contact);
  } catch (error) {
    const resStatus = error.message === "Not found" ? 404 : 400;
    res.status(resStatus);
    next(error);
  }
};

export const updateStatusContact = async (req, res, next) => {
  try {
    const { error, value } = updateFavoriteContactSchema.validate(req.body);
    if (error) throw Error(error);
    const contact = await contactsService.updateContact(req.params.id, {
      favorite: value.favorite,
    });
    if (!contact) throw Error("Not found");
    res.status(200).send(contact);
  } catch (error) {
    const resStatus = error.message === "Not found" ? 404 : 400;
    res.status(resStatus);
    next(error);
  }
};

import contactsService from "../services/contactsServices.js";
import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteContactSchema,
} from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const filter = { owner: req.user };
    const filterFavorite = req.query.favorite;
    if (filterFavorite !== undefined) {
      filter["favorite"] = filterFavorite;
    }
    let contacts = await contactsService.listContacts(filter);

    const page = parseInt(req.query.page);
    const pageSize = parseInt(req.query.limit);
    if (page && pageSize) {
      const totalPages = Math.ceil(contacts.length / pageSize);
      if (page > totalPages) {
        res.status(400);
        throw Error("Not found");
      }
      // Calculate the start and end indexes for the requested page
      const startIndex = (page - 1) * pageSize;
      const endIndex = page * pageSize;

      // Slice the contacts array based on the indexes
      contacts = contacts.slice(startIndex, endIndex);
    }
    res.status(200).send(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const contact = await contactsService.getContactById(
      req.params.id,
      req.user
    );
    if (!contact) throw Error("Not found");
    res.status(200).send(contact);
  } catch (error) {
    res.status(404);
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const contact = await contactsService.removeContact(
      req.params.id,
      req.user
    );
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
      value.phone,
      req.user
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
    const contact = await contactsService.updateContact(
      req.params.id,
      req.user,
      {
        name: value.name,
        email: value.email,
        phone: value.phone,
      }
    );
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
    const contact = await contactsService.updateContact(
      req.params.id,
      req.user,
      {
        favorite: value.favorite,
      }
    );
    if (!contact) throw Error("Not found");
    res.status(200).send(contact);
  } catch (error) {
    const resStatus = error.message === "Not found" ? 404 : 400;
    res.status(resStatus);
    next(error);
  }
};

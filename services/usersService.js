import { Users } from "../db/users.js";

export const getUserByEmail = async (email) => {
  return Users.findOne({ email }, { __v: 0 });
};

export const getUserByFilter = async (filter) => {
  return Users.findOne(filter, { __v: 0 });
};

export const getUserById = async (id) => {
  return Users.findOne({ _id: id }, { __v: 0 });
};

export const addUser = async (userObj) => {
  return Users.create(userObj);
};

export const updateUser = async (id, newData) => {
  return Users.findOneAndUpdate({ _id: id }, { ...newData }, { new: true });
};

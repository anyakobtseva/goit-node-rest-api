import { Users } from "../db/users.js";

export const getUserByEmail = async (email) => {
  return Users.findOne({ email }, { __v: 0 });
};

export const getUserById = async (id) => {
  return Users.findOne({ _id: id }, { __v: 0 });
};

export const addUser = async (email, password, subscription = "starter", avatarURL) => {
  return Users.create({
    email,
    password,
    subscription,
    avatarURL
  });
};

export const updateUser = async (id, newData) => {
  return Users.findOneAndUpdate({ _id: id }, { ...newData }, { new: true });
};

import bcrypt from "bcrypt";
import gravatar from "gravatar";
import path from "path";
import Jimp from "jimp";
import fs from "fs/promises";
import jwt from "jsonwebtoken";
import { userSchema, updateUserSchema } from "../schemas/usersSchema.js";
import {
  getUserByEmail,
  updateUser,
  addUser,
} from "../services/usersService.js";

import { storeImagePath } from "../config.js";

const secret = process.env.SECRET;
const saltRounds = 10;

const userResponse = (user) => {
  return {
    email: user.email,
    subscription: user.subscription,
    avatarURL: user.avatarUrl,
  };
};

export const createUser = async (req, res, next) => {
  try {
    const { error, value } = userSchema.validate(req.body);
    if (error) {
      res.status(400);
      throw Error(error.message);
    }

    const userFromDB = await getUserByEmail(value.email);
    if (userFromDB) {
      res.status(409);
      throw Error("Email in use");
    }

    const hashedPassword = await bcrypt.hash(value.password, saltRounds);

    //generate avatar
    const avatarURL = gravatar.url(value.email, { s: "250" }, false);

    const newUser = await addUser(
      value.email,
      hashedPassword,
      value.subscription,
      avatarURL
    );

    res.status(201).json({
      user: userResponse(newUser),
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { error, value } = userSchema.validate(req.body);
    if (error) {
      res.status(400);
      throw Error(error.message);
    }
    const userFromDB = await getUserByEmail(value.email);

    const passwordMatch = await bcrypt.compare(
      value.password,
      userFromDB?.password || ""
    );

    if (!passwordMatch) {
      res.status(401);
      throw Error("Email or password is wrong");
    }

    const payload = {
      id: userFromDB.id,
      email: userFromDB.email,
    };

    const token = jwt.sign(payload, secret, { expiresIn: "1d" });

    const updatedUser = await updateUser(userFromDB._id, { token });

    res.status(200).send({
      token,
      user: userResponse(updatedUser),
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    await updateUser(req.user._id, { token: null });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await getUserByEmail(req.user.email);
    res.status(200).send(userResponse(user));
  } catch (error) {
    next(error);
  }
};

export const updateUserSubscription = async (req, res, next) => {
  try {
    const { error, value } = updateUserSchema.validate(req.body);
    if (error) {
      res.status(400);
      throw Error(error.message);
    }

    const userFromDB = await updateUser(req.user._id, {
      subscription: value.subscription,
    });
    res.status(200).send(userResponse(userFromDB));
  } catch (error) {
    next(error);
  }
};

export const uploadAvatar = async (req, res, next) => {
  let temporaryName;
  try {
    if (!req.file) {
      res.status(400);
      throw Error("File not provided");
    }
    const { path: fPath, originalname } = req.file;
    temporaryName = fPath;
    const fileExtenstion = originalname.split(".").pop().toLowerCase();
    const fileName = path.join(
      storeImagePath,
      `${req.user._id.toString()}.${fileExtenstion}`
    );
    const url = `/avatars/${req.user._id}.${fileExtenstion}`;
    await Jimp.read(temporaryName).then((file) => {
      file.resize(250, 250).write(temporaryName);
    });

    await fs.rename(temporaryName, fileName);
    await updateUser(req.user._id, { avatarURL: url });
    res.status(200).send({ avatarURL: url });
  } catch (err) {
    req.file && (await fs.unlink(temporaryName));
    return next(err);
  }
};

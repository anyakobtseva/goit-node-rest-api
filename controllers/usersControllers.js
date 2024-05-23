import bcrypt from "bcrypt";
import gravatar from "gravatar";
import path from "path";
import Jimp from "jimp";
import fs from "fs/promises";
import { userSchema, updateUserSchema } from "../schemas/usersSchema.js";
import {
  getUserByEmail,
  updateUser,
  addUser,
} from "../services/usersService.js";
import jwt from "jsonwebtoken";
import { storeImagePath } from "../app.js";

const secret = process.env.SECRET;
const saltRounds = 10;

const userResponse = (user) => {
  return {
    email: user.email,
    subscription: user.subscription,
    avatarURL: user.avatarURL,
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
  const { path: temporaryName, originalname } = req.file;
  const fileExtenstion = originalname.split(".").pop();
  const fileName = path.join(
    storeImagePath,
    `${req.user._id.toString()}.${fileExtenstion}`
  );
  const url = `${req.protocol}://${req.get("host")}/avatars/${
    req.user._id
  }.${fileExtenstion}`;
  try {
    await Jimp.read(temporaryName).then((file) => {
      file.resize(250, 250).write(temporaryName);
    });

    await fs.rename(temporaryName, fileName);
    await updateUser(req.user._id, { avatarURL: url });
  } catch (err) {
    await fs.unlink(temporaryName);
    return next(err);
  }

  res.status(200).send({ avatarURL: url });
};

import bcrypt from "bcrypt";
import { userSchema, updateUserSchema } from "../schemas/usersSchema.js";
import {
  getUserByEmail,
  updateUser,
  addUser,
} from "../services/usersService.js";
import jwt from "jsonwebtoken";

const secret = process.env.SECRET;
const saltRounds = 10;

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

    const newUser = await addUser(
      value.email,
      hashedPassword,
      value.subscription
    );

    res.status(201).json({
      email: newUser.email,
      subscription: newUser.subscription,
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

    const token = jwt.sign(payload, secret, { expiresIn: "1h" });
    const updatedUser = await updateUser(userFromDB._id, { token });
    res.status(200).send({
      token,
      user: {
        email: updatedUser.email,
        subscription: updatedUser.subscription,
      },
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
    res.status(200).send({
      email: user.email,
      subscription: user.subscription,
    });
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
    res.status(200).send({
      email: userFromDB.email,
      subscription: userFromDB.subscription,
    });
  } catch (error) {
    next(error);
  }
};

import Joi from "joi";

export const userSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().email().required(),
  subscription: Joi.string().valid("starter", "pro", "business"),
}).required();

export const updateUserSchema = Joi.object({
  password: Joi.string(),
  email: Joi.string().email(),
  subscription: Joi.string().valid("starter", "pro", "business"),
}).required();
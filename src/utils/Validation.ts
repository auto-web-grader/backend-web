import Joi from "joi";

export const registerValidation = Joi.object({
  name: Joi.string()
    .required()
    .regex(/([A-Za-z]+( [A-Za-z]+)+)/i),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

export const loginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

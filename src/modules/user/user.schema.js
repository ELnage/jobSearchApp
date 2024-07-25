import Joi from "joi";
import { generalRules } from "../../utils/general-rules.utils.js";
import { systemRoles } from "../../utils/system-roles.utils.js";

export const signUpSchema = {
  body: Joi.object({
    firstName: Joi.string().required().alphanum(),
    lastName: Joi.string().required().alphanum(),
    mobileNumber: generalRules.phoneNumber.required(),
    email: Joi.string().email().required(),
    recoveryEmail: Joi.string().email().required(),
    password: generalRules.password.required(),
    birthDate: Joi.date().required(),
    role: Joi.string().valid(...Object.values(systemRoles)),
  }),
};
export const updateSchema = {
  body: Joi.object({
    firstName: Joi.string().alphanum(),
    lastName: Joi.string().alphanum(),
    mobileNumber: generalRules.phoneNumber,
    email: Joi.string().email(),
    recoveryEmail: Joi.string().email(),
    password: generalRules.password,
    birthDate: Joi.date(),
    role: Joi.string().valid(...Object.values(systemRoles)),
  }),
  headers: generalRules.headers,
};

export const getUserSchema = {
  params: Joi.object({
    id: generalRules.objectId.required(),
  }),
};

export const updatePasswordSchema = {
  body: Joi.object({
    oldPassword: generalRules.password.required(),
    newPassword: generalRules.password.required(),
  }),
  headers: generalRules.headers,
};

export const deleteUserSchema = { 
  body : Joi.object({
    password : generalRules.password.required()
  }),
  headers : generalRules.headers
}
export const forgetPasswordSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
  }),
}

export const resetPasswordSchema = {
  body: Joi.object({
    newPassword: generalRules.password.required(),
    OTP: Joi.required(),
    email: Joi.string().email().required(),
  }),
};



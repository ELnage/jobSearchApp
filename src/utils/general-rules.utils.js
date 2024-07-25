import Joi from "joi";
import mongoose from "mongoose";

const objectIdRule = (value , helper)=> {
  const isValid = mongoose.Types.ObjectId.isValid(value);
  if(isValid){
    return value
  }
  return helper.message("invalid object id")
}
export const generalRules = {
  objectId: Joi.custom(objectIdRule),
  password: Joi.string()
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$!%*?&])[A-Za-z\d$!%*?&]{8,}$/
    )
    .messages({
      "string.pattern.base":
        "Password must have at least one lowercase letter, one uppercase letter, one number and one special character",
      "any.required": "You must enter your password",
    }),
  phoneNumber: Joi.string()
    .pattern(/^(?:\+2)?(?:0|1)?(?:\+20|0020)?1[0125]\d{8}$/)
    .messages({
      "string.pattern.base":
        "Phone number must be a valid Egyptian phone number",
      "any.required": "You must enter your phone number",
    }),
  headers: Joi.object({
    "content-type": Joi.string().optional(),
    accept: Joi.string().optional(),
    "accept-encoding": Joi.string().optional(),
    host: Joi.string().optional(),
    connection: Joi.string().optional(),
    "content-length": Joi.string().optional(),
    "user-agent": Joi.string().optional(),
    "accept-language": Joi.string().optional(),
    "accept-charset": Joi.string().optional(),
    "postman-token": Joi.string().optional(),
    "postman-id": Joi.string().optional(),
    token: Joi.string().required(),
  }),
};
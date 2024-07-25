import Joi from "joi";
import { generalRules } from '../../utils/general-rules.utils.js';

export const addCompany = {
  body: Joi.object({
    companyName: Joi.string().required(),
    description: Joi.string().required(),
    industry: Joi.string().required(),
    address: Joi.string().required(),
    numberOfEmployees: Joi.number().required().min(11).max(20),
    companyEmail: Joi.string().email().required(),
  }),
  headers: generalRules.headers
}

export const updateCompany = {
  body: Joi.object({
    companyName: Joi.string().required(),
    companyId : generalRules.objectId.required(),
    password: generalRules.password.required(),
    description: Joi.string(),
    industry: Joi.string(),
    address: Joi.string(),
    numberOfEmployees: Joi.number().min(11).max(20),
    companyEmail: Joi.string().email(),
  }),
  headers: generalRules.headers
}
export const deleteCompany = {
  body : Joi.object({
    companyId : generalRules.objectId.required(),
    password : generalRules.password.required()
  }),
  headers : generalRules.headers
}
export const getCompanyWithJobs = {
  params : Joi.object({
    companyId : generalRules.objectId.required()
  }),
  headers : generalRules.headers
}
import Joi from "joi";
import { generalRules } from "../../utils/general-rules.utils.js";

export const addJobSchema = {
  body: Joi.object({
    jobTitle: Joi.string().required(),
    jobLocation: Joi.string().required().valid("onsite", "remotely", "hybrid"),
    workingTime: Joi.string().required().valid("full time", "part time"),
    seniorityLevel: Joi.string()
      .required()
      .valid("Junior", "Mid-Level", "Senior", "Team-Lead", "CTO"),
    jobDescription: Joi.string().required(),
    technicalSkills: Joi.array().items(Joi.string()),
    softSkills: Joi.array().items(Joi.string()),
  }),
  headers: generalRules.headers,
};

export const updateJobSchema = {
  body: Joi.object({
    jobTitle: Joi.string(),
    jobLocation: Joi.string().valid("onsite", "remotely", "hybrid"),
    workingTime: Joi.string().valid("full time", "part time"),
    seniorityLevel: Joi.string()
      .valid("Junior", "Mid-Level", "Senior", "Team-Lead", "CTO"),
    jobDescription: Joi.string(),
    technicalSkills: Joi.array().items(Joi.string()),
    softSkills: Joi.array().items(Joi.string()),
  }),
  headers: generalRules.headers,
}

export const filterJobsSchema = {
  query: Joi.object({
    jobTitle: Joi.string(),
    jobLocation: Joi.string().valid("onsite", "remotely", "hybrid"),
    workingTime: Joi.string().valid("full time", "part time"),
    seniorityLevel: Joi.string()
      .valid("Junior", "Mid-Level", "Senior", "Team-Lead", "CTO"),
    jobDescription: Joi.string(),
    technicalSkills: Joi.string()
  }),
  headers: generalRules.headers,
}


export const applyToJobSchema = {
  body: Joi.object({
    jobId: generalRules.objectId.required(),
    userTechSkills: Joi.array().items(Joi.string()),
    userSoftSkills: Joi.array().items(Joi.string()),
    userResume : Joi.required()
  }),
  headers: generalRules.headers,
};
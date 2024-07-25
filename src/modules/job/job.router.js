import { Router } from "express";
import { errorHandler } from './../../middlewares/error-handling.middleware.js';
import { authenticationMiddleware } from './../../middlewares/authentication.middleware.js';
import { authorizationMiddleware } from './../../middlewares/authorization.middleware.js';
import { validationMiddleware } from './../../middlewares/validation.middleware.js';
import * as jobController from "./job.controller.js"
import * as jobSchema from "./job.schema.js";
import {systemRoles} from "../../utils/system-roles.utils.js";
const router = Router()
const { user, Company_HR } = systemRoles;
router.post(
  "/add",
  authenticationMiddleware(),
  authorizationMiddleware([Company_HR]),
  validationMiddleware(jobSchema.addJobSchema),
  errorHandler(jobController.addJob)
);

router.put(
  "/update/:jobId",
  authenticationMiddleware(),
  authorizationMiddleware([Company_HR]),
  validationMiddleware(jobSchema.updateJobSchema),
  errorHandler(jobController.updateJob)
);

router.delete("/delete/:jobId", authenticationMiddleware(), authorizationMiddleware([Company_HR]), errorHandler(jobController.deleteJob));

router.get("/alljobs", authenticationMiddleware() , authorizationMiddleware([user, Company_HR]) , errorHandler(jobController.getAllJobs));
router.get("/companyJobs", authenticationMiddleware() , authorizationMiddleware([user, Company_HR]) , errorHandler(jobController.getCompanyJobs));
router.get("/filter" , authenticationMiddleware() , authorizationMiddleware([user, Company_HR])  , validationMiddleware(jobSchema.filterJobsSchema), errorHandler(jobController.filterJobs));
router.post(
  "/apply",
  authenticationMiddleware(),
  authorizationMiddleware([user]),
  errorHandler(jobController.applyToJob)
);
export default router
import { Router } from "express";
import * as companyController from "./company.controller.js";
import * as companySchema from "./company.schema.js";
import { errorHandler } from "./../../middlewares/error-handling.middleware.js";
import { authenticationMiddleware } from "./../../middlewares/authentication.middleware.js";
import { authorizationMiddleware } from "./../../middlewares/authorization.middleware.js";
import { systemRoles } from "../../utils/system-roles.utils.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
const { user, Company_HR } = systemRoles;
const router = Router();

router.post(
  "/add",
  authenticationMiddleware(),
  authorizationMiddleware([Company_HR]),
  validationMiddleware(companySchema.addCompany),
  errorHandler(companyController.addCompany)
);

router.put(
  "/update",
  authenticationMiddleware(),
  authorizationMiddleware([Company_HR]),
  validationMiddleware(companySchema.updateCompany),
  errorHandler(companyController.updateCompany)
);
router.delete("/delete",
  authenticationMiddleware(),
  authorizationMiddleware([Company_HR]),
  validationMiddleware(companySchema.deleteCompany),
  errorHandler(companyController.deleteCompany))
router.get(
  "/companyWithJobs/:companyId",
  authenticationMiddleware(),
  authorizationMiddleware([Company_HR]),
  validationMiddleware(companySchema.getCompanyWithJobs),
  errorHandler(companyController.getCompanyWithJobs)
);

router.get(
  "/getCompany",
  authenticationMiddleware(),
  authorizationMiddleware([user, Company_HR]),
  errorHandler(companyController.getCompanyByName)
);

router.get(
  "/getAllApplications/:jobId",
  authenticationMiddleware(),
  authorizationMiddleware([Company_HR]),
  errorHandler(companyController.getAllApplications)
);

router.get("/AllApplicationsToExcel" , authenticationMiddleware() , authorizationMiddleware([Company_HR]) , errorHandler(companyController.sendAllApplicationsToExcel));
export default router;

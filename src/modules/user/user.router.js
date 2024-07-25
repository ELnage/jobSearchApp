import { Router } from "express";
import * as userController from "./user.controller.js"
import { validationMiddleware } from './../../middlewares/validation.middleware.js';
import  * as userSchema from "./user.schema.js";
import { errorHandler } from "../../middlewares/error-handling.middleware.js";
import { authenticationMiddleware } from "../../middlewares/authentication.middleware.js";

const router = Router()

router.post("/signup", validationMiddleware(userSchema.signUpSchema) , errorHandler(userController.signUp));
router.get("/confirm/:token", errorHandler(userController.confirmEmail));
router.post("/signin", errorHandler(userController.signIn));
router.patch("/logOut", authenticationMiddleware(), errorHandler(userController.logOut));
router.put(
  "/update",
  authenticationMiddleware(),
  validationMiddleware(userSchema.updateSchema),
  errorHandler(userController.updateUser)
);


router.delete(
  "/delete",
  authenticationMiddleware(),
  validationMiddleware(userSchema.deleteUserSchema),
  errorHandler(userController.deleteUser)
);

router.get("/owner", authenticationMiddleware(), errorHandler(userController.getOwnerData));

router.get(
  "/getUser/:id",
  validationMiddleware(userSchema.getUserSchema),
  errorHandler(userController.getUser)
);

router.patch(
  "/updatePassword",
  authenticationMiddleware(),
  validationMiddleware(userSchema.updatePasswordSchema),
  errorHandler(userController.updatePassword)
);
router.post(
  "/forgetPassword",
  validationMiddleware(userSchema.forgetPasswordSchema),
  errorHandler(userController.forgetPassword)
);
router.post(
  "/resetPassword",
  validationMiddleware(userSchema.resetPasswordSchema),
  errorHandler(userController.resetPassword)
);



router.get(
  "/usersByRecoveryEmail", authenticationMiddleware(), 
  errorHandler(userController.getUsersByRecoveryEmail)
);
export default router





import jwt from "jsonwebtoken"
import { ErrorHandel } from "../utils/error-class.utils.js"
import User from "../../DB/models/user.model.js";
/** 
 * @returns {Function} middleware function
 * @description authentication middleware check if token is valid or not
 */
export const authenticationMiddleware = () => {
  return async (req, res, next) => {
    // destructure token from headers
    console.log(req.route.path);
    const { token } = req.headers;
    // if token is not provided return error
    if (!token) return next(new ErrorHandel("token is required", 404));
    // check if token start with bearer or not
    if (!token.startsWith(process.env.PREFIX_SECRET))
      return next(new ErrorHandel("token is invalid", 401));
    // remove bearer from token
    const originalToken = token.split(" ")[1];
    let data;
    try { 
      // verify token to check if it is valid
      data = jwt.verify(originalToken, process.env.JWT_SECRET_SIGNIN);
    } catch (error) {
      // if token is invalid return error
      next(new ErrorHandel("token is invalid", 401));
    }
    // check if user data is exist in token or not
    if (!data?._id) {
      return next(new ErrorHandel("Invalid token payload", 400));
    }

    // check if user data is exist in database or not
    const userData = await User.findById(data?._id);
    if (!userData) {
      // if user data is not exist return error
      return next(new ErrorHandel("user not found", 404));
    }

    // set user data in request
    req.authUser = userData;
    next();
  };
};

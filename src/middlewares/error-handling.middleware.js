import { ErrorHandel } from "../utils/error-class.utils.js";
/**
 * 
 * @param {Function} API API function that returns promise 
 * @returns {Function} middleware function
 * @description This middleware is handeling errors in APIS 
 */
export const errorHandler = (API)=> {
  return (res, req, next) => {
    API(res, req, next).catch((err)=> {
      // if error in API return log error and send error response by error class
      console.log("error in errorHandler" , err);
      next(new ErrorHandel("Internal Server error", 500, err.message , err.stack))
    })
  };
}
/**
 * 
 * @param {Object} err 
 * @param {Object} req 
 * @param {Object} res 
 * @param {Object} next 
 * @returns response message
 */
export const globalResponse = (err , req , res , next)=> {
  // if error send error response
if(err) {
  res.status(err.status || 500).json({
    msg : err.message , 
    error : err.data,
    stack : err.stack,
  })
}
}

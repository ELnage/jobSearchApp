import { ErrorHandel } from "../utils/error-class.utils.js"
/**
 * 
 * @param {Array[string]} allowedRoles  Array of allowed roles
 * @returns {Function} middleware function
 * @description This middleware checks if the user is authorized to access the route
 */
export const authorizationMiddleware = (allowedRoles)=> {
return (req , res , next)=> {
  //destructure role from authUser from authentication middleware
  const {role} = req.authUser
  if(!allowedRoles.includes(role)) {
    //if role not in allowedRoles return error
    return next(new ErrorHandel("you are not authorized" , 403))
  }
  next()
}
}
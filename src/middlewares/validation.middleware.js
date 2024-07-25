import { ErrorHandel } from './../utils/error-class.utils.js';
const reqKeys = ["body", "query", "params", "headers"];
/**
 * 
 * @param {object} schema 
 * @returns {Function} middleware function
 * @description This middleware checks if the request data is valid or not
 */
export const validationMiddleware = (schema) => {
  return (req, res, next) => {
    // validation errors array
    const validationErrors = [];
    for (const key of reqKeys) {
        // Validate the request data against the schema of the same key
        const validationResult = schema[key]?.validate(req[key],
          { abortEarly: false });
          if (validationResult?.error) {
        // If validation fails, push the error to the validationErrors array
        validationErrors.push(validationResult?.error?.details);
      }
    }
    // If validationErrors array is not empty, return error
    if (validationErrors.length > 0) {
    
      return next(new ErrorHandel("validation error", 400, validationErrors));
    }
    
    next();
  };
}
import { validationResult } from "express-validator";
import AppError from "../utils/appError.js";

const HandleValidationRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array(), 400));
    // return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export default HandleValidationRequest;
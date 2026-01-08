// routes/user.route.js
import { Router } from "express";
import { body } from "express-validator";
import UserController from "../controllers/user.controller.js";
import HandleValidationRequest from "../middleware/AuthMiddleware.js"; // your validation middleware
import User from "../models/user.model.js";

const router = Router();

router.post(
  "/register",
  [
    // username letters only, min 3 chars
    body("userName")
      .notEmpty().withMessage("User name is required")
      .matches(/^[A-Za-z\s]{3,}$/)
      .withMessage("User name must have at least 3 letters"),

    // email
    // body("email")
    //   .notEmpty().withMessage("Email is required")
    //   .isEmail().withMessage("Invalid email format"),
      // .custom(async value => {
      //   const userData = await User.findOne({ email: value });
      //   if (userData) throw new Error("Email already exists");
      //   return true;
      // }),

    // phone: Myanmar phone number example
    body("phone")
      .notEmpty().withMessage("Phone is required")
      .matches(/^09\d{7,9}$/)
      .withMessage("Phone number is invalid. Example: 0991234567"),

    // password: min 6 chars, 1 letter + 1 number
    body("password")
      .notEmpty().withMessage("Password is required")
      .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)
      .withMessage("Password must be minimum 6 characters, with at least 1 letter and 1 number"),

    // userRole: only specific values
    body("userRole")
      .optional()
      .isIn(["Agent", "Normal User"]) // removed admin
      .withMessage("Invalid user role"),

    // address validation
    body("address.street").optional().notEmpty().withMessage("Street cannot be empty"),
    body("address.city").optional().notEmpty().withMessage("City cannot be empty"),
    body("address.state").optional().notEmpty().withMessage("State cannot be empty"),
    body("address.country").optional().notEmpty().withMessage("Country cannot be empty"),

    // image validation: jpg, jpeg, png, webp only
    body("image")
      .optional()
      .matches(/\.(jpg|jpeg|png|webp)$/i)
      .withMessage("Image must be a valid image file (jpg, jpeg, png, webp)"),

    // socialLinks: optional, each must be a URL
    body("socialLinks.*")
      .optional()
      .isURL()
      .withMessage("Each social link must be a valid URL")
  ],
  HandleValidationRequest,
  UserController.register
);

export default router;

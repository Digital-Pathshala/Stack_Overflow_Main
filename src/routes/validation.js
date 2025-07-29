import { body, validationResult } from "express-validator"

export const validateRegister = [
  body("fullName").trim().isLength({ min: 2, max: 50 }).withMessage("Full name must be between 2 and 50 characters"),

  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email address"),

  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),

  body("confirmPassword").custom((confirmPassword, { req }) => {
    if (confirmPassword !== req.body.password) {
      throw new Error("Passwords do not match")
    }
    return true
  }),
]

export const validateLogin = [
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email address"),

  body("password").notEmpty().withMessage("Password is required"),
]

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    })
  }
  next()
}
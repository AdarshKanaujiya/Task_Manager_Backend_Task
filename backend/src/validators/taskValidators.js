import { body } from "express-validator";

export const taskCreationValidator = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 20 })
    .withMessage("Title can be maximum 20 characters long"),
  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 200 })
    .withMessage("Description can be maximum 200 characters long")
    .isString()
    .withMessage("Description must be a string"),
];

export const taskUpdateValidator = [
  body("title")
    .optional()
    .isLength({ max: 20 })
    .withMessage("Title can be maximum 20 characters long"),
  body("description")
    .optional()
    .isLength({ max: 200 })
    .withMessage("Description can be maximum 200 characters long")
    .isString()
    .withMessage("Description must be a string"),
  body("status")
    .optional()
    .isIn(["pending", "in-progress", "completed"])
    .withMessage("Status must be one of: pending, in-progress, completed"),
];

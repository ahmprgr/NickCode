const express = require("express");
const {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategory,
} = require("./categoryController.js");
const validator = require("../../../../middlewares/validator.js");
const {
  categoryValidationSchema,
  categoryUpdateValidationSchema,
} = require("../../../../utils/validators/categoryValidator.js");

const router = express.Router();

router.post("/create", validator(categoryValidationSchema), createCategory);

router.put("/update", validator(categoryUpdateValidationSchema), updateCategory);

router.delete("/delete", deleteCategory);

router.get("/", getAllCategory);

module.exports = router;

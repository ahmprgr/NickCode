const yup = require("yup");

const categoryValidationSchema = yup.object({
  name: yup.string().min(5).max(50).required(),
  slug: yup.string().min(3).max(30).required(),
});

const categoryUpdateValidationSchema = yup.object({
  newName: yup.string().min(5).max(50).required(),
  newSlug: yup.string().min(3).max(30).required(),
  oldSlug: yup.string().min(3).max(30).required(),
});

module.exports = { categoryValidationSchema, categoryUpdateValidationSchema };

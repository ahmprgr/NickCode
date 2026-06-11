const yup = require("yup");

const courseValidationSchema = yup.object({
  title: yup.string().min(8).max(50).required(),
  slug: yup.string().min(3).max(30).required(),
  description: yup.string().min(100).max(2500).required(),
  prerequisites: yup.array().min(1).max(8).required(),
});

module.exports = courseValidationSchema;

const yup = require("yup");

const courseValidationSchema = yup.object({
  title: yup.string().min(8).max(50).required(),
  slug: yup.string().min(3).max(30).required(),
  description: yup.string().min(100).max(2500).required(),
  prerequisites: yup.string().min(5).required(),
});
const courseUpdateValidationSchema = yup.object({
  newTitle: yup.string().min(8).max(50).required(),
  newSlug: yup.string().min(3).max(30).required(),
  newDescription: yup.string().min(100).max(2500).required(),
  newPrerequisites: yup.string().min(5).required(),
});

module.exports = { courseValidationSchema, courseUpdateValidationSchema };

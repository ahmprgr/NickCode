const yup = require("yup");

const lessonsValidationSchema = yup.object({
  title: yup.string().min(5).max(25).required(),
  slug: yup.string().min(3).max(20).required(),
  content: yup.string().min(500).max(5000).required(),
  chapter: yup.string().min(24).max(24).required(),
});

const lessonsUpdateValidationSchema = yup.object({
  newTitle: yup.string().min(5).max(25).required(),
  newSlug: yup.string().min(3).max(20).required(),
  newContent: yup.string().min(500).max(5000).required(),
  lesson: yup.string().min(24).max(24).required(),
});

module.exports = { lessonsValidationSchema, lessonsUpdateValidationSchema };

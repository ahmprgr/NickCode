const yup = require("yup");

const chapterValidationSchema = yup.object({
  title: yup.string().min(5).max(25).required(),
  course: yup.string().min(24).max(24).required(),
});

const chapterUpdateValidationSchema = yup.object({
  newTitle: yup.string().min(5).max(25).required(),
  chapterId:yup.string().min(24).max(24).required()
});

module.exports = { chapterUpdateValidationSchema,chapterValidationSchema };

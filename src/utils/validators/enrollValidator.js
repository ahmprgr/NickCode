const yup = require("yup");

const enrollValidationSchema = yup.object({
  course: yup.string().min(24).max(24).required(),
});

module.exports = enrollValidationSchema

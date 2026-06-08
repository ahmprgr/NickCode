const yup = require("yup");

const userValidationSchema = yup.object({
  fullname: yup.string().min(6).max(50).required(),
  email: yup.string().email().required(),
  password: yup.string().min(8).max(25).required(),
});

const userUpdateValidationSchema = yup.object({
  newFullname: yup.string().min(6).max(50).required(),
  newEmail: yup.string().email().required(),
  newPassword: yup.string().min(8).max(25).required(),
});

module.exports = { userValidationSchema, userUpdateValidationSchema };

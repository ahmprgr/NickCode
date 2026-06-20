const express = require("express");
const {
  createCourse,
  editCourse,
  deleteCourse,
  getAllCourse,
} = require("./coursesController");
const upload = require("./../../../../middlewares/upload/imgUploader");
const {
  courseValidationSchema,
  courseUpdateValidationSchema,
} = require("./../../../../utils/validators/courseValidator");
const validator = require("./../../../../middlewares/validator");

const router = express.Router();

router.post(
  "/create",
  upload.single("coverImage"),
  validator(courseValidationSchema),
  createCourse,
);
router.put(
  "/edit",
  upload.single("coverImage"),
  validator(courseUpdateValidationSchema),
  editCourse,
);
router.delete("/delete", deleteCourse);
router.get("/", getAllCourse);

module.exports = router;

const express = require("express");
const {
  enroll,
  getAllEnrolledCourses,
  getAllEnrolledCourseInformation,
  setLessonViewed,
  isCourseEnrolled,
} = require("./enrollController");
const enrollValidationSchema = require("./../../../utils/validators/enrollValidator");
const validator = require("./../../../middlewares/validator");

const router = express.Router();

router.post("/enroll", validator(enrollValidationSchema), enroll);
router.get("/", getAllEnrolledCourses);
router.patch("/setLesson", setLessonViewed);
router.get("/isEnrolled", isCourseEnrolled);

module.exports = router;

const express = require("express");
const {
  createLesson,
  editLesson,
  deleteLesson,
  getAllLessonsByAuthor,
} = require("./lessonController");
const {
  lessonsValidationSchema,
  lessonsUpdateValidationSchema,
} = require("./../../../../../utils/validators/lessonValidator");
const validator = require("./../../../../../middlewares/validator");

const router = express.Router();

router.post("/create", validator(lessonsValidationSchema), createLesson);
router.put("/edit", validator(lessonsUpdateValidationSchema), editLesson);
router.delete("/delete", deleteLesson);
router.get("/", getAllLessonsByAuthor);

module.exports = router;

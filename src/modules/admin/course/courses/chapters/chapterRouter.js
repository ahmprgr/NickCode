const express = require("express");
const {
  createChapter,
  editChapter,
  deleteChapter,
  getAllChapterByAuthor,
} = require("./chapterController");
const {
  chapterValidationSchema,
  chapterUpdateValidationSchema,
} = require("./../../../../../utils/validators/chapterValidator");
const validator = require("./../../../../../middlewares/validator");

const router = express.Router();

router.post("/create", validator(chapterValidationSchema), createChapter);
router.put("/edit", validator(chapterUpdateValidationSchema), editChapter);
router.delete("/delete", deleteChapter);
router.get("/", getAllChapterByAuthor);

module.exports = router;

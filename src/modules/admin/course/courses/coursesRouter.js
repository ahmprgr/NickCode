const express = require("express");
const {
  createCourse,
  editCourse,
  deleteCourse,
  getAllCourse,
} = require("./coursesController");

const router = express.Router();

router.post("/create",createCourse);
router.put("/edit",editCourse);
router.delete("delete",deleteCourse);
router.get("/",getAllCourse);

module.exports = router

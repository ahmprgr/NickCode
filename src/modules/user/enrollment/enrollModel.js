const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: true,
    },
    course: {
      type: mongoose.Types.ObjectId,
      ref: "courses",
      required: true,
    },
    completedLessons: {
      type: Array,
      default: [],
    },
    progress: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const model = mongoose.model("enrolledCourses", schema);

module.exports = model;

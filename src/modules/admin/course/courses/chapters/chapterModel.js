const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    course: {
      type: mongoose.Types.ObjectId,
      ref: "courses",
      required: true,
    },
  },
  { timestamps: true },
);

const model = new mongoose.model("chapter", schema);

module.exports = model;

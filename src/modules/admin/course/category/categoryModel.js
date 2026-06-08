const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    students: {
      type: Number,
      required: true,
      default: 0,
    },
    courses: {
      type: Number,
      required: true,
      default: 0,
    },
    educationalArticles: {
      type: Number,
      required: true,
      default: 0,
    },
    author: {
      type: mongoose.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  },
);

const model = new mongoose.model("categories", schema);

module.exports = model;

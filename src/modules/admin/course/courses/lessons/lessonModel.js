const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    chapter: {
      type: mongoose.Types.ObjectId,
      ref: "chapters",
      required: true,
    },
  },
  { timestamps: true },
);

const model = mongoose.model("lessons",schema)

module.exports = model

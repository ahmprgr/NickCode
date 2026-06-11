const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "categories",
      required: true,
    },
    author: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      enum: ["مبتدی", "متوسط", "پیشرفته"],
      default: "مبتدی",
    },
    rating: {
      type: Number,
      default: 0,
    },
    commentCount: {
      type: Number,
      default: 0,
    },
    prerequisites: {
      type: Array,
      required: true
    },
    status: {
      type: String,
      enum: ["بزودی", "منتشر شده"],
      default: "بزودی",
    },
    students: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const model = mongoose.model("courses", schema);

module.exports = model;

const chapterModel = require("../admin/course/courses/chapters/chapterModel");
const courseModel = require("../admin/course/courses/coursesModel");

exports.getAllChapters = async (req, res) => {
  try {
    const courses = await courseModel.find();

    const result = [];

    for (const course of courses) {
      const chapters = await chapterModel
        .find({ course: course._id })
        .sort({ createdAt: 1 });

      result.push({
        courseId: course._id,
        courseTitle: course.title,
        chapters,
      });
    }

    return res.json({
      message: "اطلاعات با موفقیت دریافت شد",
      result,
    });
  } catch (e) {
    return res.status(500).json({
      message: "internal server error",
      error: e.message,
    });
  }
};

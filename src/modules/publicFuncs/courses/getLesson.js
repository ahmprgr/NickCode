const lessonModel = require("./../../admin/course/courses/lessons/lessonModel");
const courseModel = require("./../../admin/course/courses/coursesModel");
const chapterModel = require("./../../admin/course/courses/chapters/chapterModel");

exports.getAllLessonsInCourse = async (req, res) => {
  try {
    const { courseSlug } = req.params;
    const courses = await courseModel.find({ slug: courseSlug }).select("_id");
    if (courses.length) {
      const chapters = await chapterModel
        .find({
          course: { $in: courses.map((course) => course._id) },
        })
        .select("_id title")
        .sort({ createdAt: 1 });

      const lessonsObj = [];

      for (const chapter of chapters) {
        const lessons = await lessonModel
          .find({ chapter: chapter._id })
          .select("_id title slug content")
          .sort({ createdAt: 1 });

        lessonsObj.push({
          chapterId: chapter._id,
          chapterTitle: chapter.title,
          lessons,
        });
      }
      return res.json({
        message: "اطلاعات با موفقیت دریافت شد",
        lessonsObj,
      });
    }
    return res.status(404).json({
      message: "دوره ای با این آدرس وجود ندارد",
    });
  } catch (e) {
    return res.status(500).json({
      message: "internal server error",
      error: e.message,
    });
  }
};

exports.getLessonBySlug = async (req, res) => {
  try {
    const { courseSlug, lessonSlug } = req.params;
    const currentCourse = await courseModel
      .findOne({ slug: courseSlug })
      .select("_id");
    if (currentCourse) {
      const currentLesson = await lessonModel
        .findOne({ slug: lessonSlug })
        .select("_id title slug content");
      if (currentLesson) {
        return res.json({
          messgae: "اطلاعات با موفقیت دریافت شد",
          lessonObj: currentLesson,
        });
      }
      return res.status(404).json({
        message: "درسی با این آدرس وجود ندارد",
      });
    }
    return res.status(404).json({
      message: "دوره ای با این آدرس وجود ندارد",
    });
  } catch (e) {
    return res.status(500).jsoon({
      message: "internal server error",
      error: e.message,
    });
  }
};

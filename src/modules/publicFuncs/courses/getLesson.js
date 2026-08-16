const lessonModel = require("./../../admin/course/courses/lessons/lessonModel");
const courseModel = require("./../../admin/course/courses/coursesModel");
const chapterModel = require("./../../admin/course/courses/chapters/chapterModel");

/**
 * @swagger
 * /api/courses/{courseSlug}/lessons:
 *   get:
 *     summary: دریافت اطلاعات تمامی درس های مرتبط با فصل آن
 *     tags: [Lesson]
 *     parameters:
 *       - in: path
 *         name: courseSlug
 *         required: true
 *         schema:
 *           type: string
 *         description: آدرس دوره مورد نظر
 *         example: "python"
 *     responses:
 *       200:
 *         description: دریافت موفقیت آمیز اطلاعات تمامی درس ها
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "اطلاعات با موفقیت دریافت شد"
 *                 lessonsObj:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       chapterId:
 *                         type: string
 *                         description: شناسه فصل
 *                         example: "65f2a1b3c4d5e6f7a8b9c0d1"
 *                       chapterTitle:
 *                         type: string
 *                         description: عنوان فصل
 *                       lessons:
 *                         type: array
 *                         description: لیست درس های فصل
 *                         items:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                               description: شناسه درس
 *                               example: "65f2a1b3c4d5e6f7a8b9c0d1"
 *                             title:
 *                               type: string
 *                               description: عنوان درس
 *                             content:
 *                               type: string
 *                               description: محتوای درس    
 */

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

/**
 * @swagger
 * /api/courses/{courseSlug}/lessons/{lessonSlug}:
 *   get:
 *     summary: دریافت اطلاعات تمامی درس های مرتبط با فصل آن
 *     tags: [Lesson]
 *     parameters:
 *       - in: path
 *         name: courseSlug
 *         required: true
 *         schema:
 *           type: string
 *         description: آدرس دوره مورد نظر
 *         example: "python"
 *       - in: path
 *         name: lesssonSlug
 *         required: true
 *         schema:
 *           type: string
 *         description: آدرس درس مورد نظر
 *         example: "install-python"
 *     responses:
 *       200:
 *         description: دریافت موفقیت آمیز اطلاعات تمامی درس ها
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "اطلاعات با موفقیت دریافت شد"
 *                 lessonObj:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       format: ObjectId
 *                       example: "65f2a1b3c4d5e6f7a8b9c0d1"
 *                     title:
 *                       type: string
 *                     slug:
 *                       type: string
 *                     content:
 *                       type: string  
 */

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

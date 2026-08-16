const chapterModel = require("../../admin/course/courses/chapters/chapterModel");
const courseModel = require("../../admin/course/courses/coursesModel");

/**
 * @swagger
 * /api/chapters/:
 *   get:
 *     summary: دریافت اطلاعات تمامی فصل ها
 *     tags: [Chapter]
 *     responses:
 *       200:
 *         description: دریافت موفقیت آمیز اطلاعات تمامی فصل ها
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "اطلاعات با موفقیت دریافت شد"
 *                 chaptersObj:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       courseId:
 *                         type: string
 *                         description: شناسه دوره
 *                         example: "65f2a1b3c4d5e6f7a8b9c0d1"
 *                       courseTitle:
 *                         type: string
 *                         description: عنوان دوره
 *                       chapters:
 *                         type: array
 *                         description: لیست فصل‌های دوره
 *                         items:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                               description: شناسه فصل
 *                               example: "65f2a1b3c4d5e6f7a8b9c0d1"
 *                             title:
 *                               type: string
 *                               description: عنوان فصل
 *                             course:
 *                               type: string
 *                               description: شناسه دوره مرتبط
 *                               example: "65f2a1b3c4d5e6f7a8b9c0d1"
 */


exports.getAllChapters = async (req, res) => {
  try {
    const courses = await courseModel.find();

    const result = [];

    for (const course of courses) {
      const chapters = await chapterModel
        .find({ course: course._id })
        .select("_id title course")
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

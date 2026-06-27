const courseModel = require("../../admin/course/courses/coursesModel");

/**
 * @swagger
 * /api/courses/:
 *   get:
 *     summary: دریافت اطلاعات تمامی دوره ها
 *     tags: [course]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: دریافت موفقیت آمیز اطلاعات تمامی دوره ها
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "اطلاعات با موفقیت دریافت شد"
 *                 user:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                     slug:
 *                       type: string
 *                     description:
 *                       type: string
 *                     category:
 *                       type: string
 *                     author:
 *                       type: string
 *                     coverImage:
 *                       type: string
 *                     level:
 *                       type: string
 *                     status:
 *                       type: string
 *                     prerequisites:
 *                       type: array
 *                       items:
 *                         type: string
 *                     rating:
 *                       type: number
 *                     commentCount:
 *                       type: number
 */

exports.getCourses = async (req, res) => {
  try {
    const allCourses = await courseModel.find().lean();
    allCourses.forEach((course) => {
      Reflect.deleteProperty(course, "createdAt");
      Reflect.deleteProperty(course, "updatedAt");
      Reflect.deleteProperty(course, "_id");
      Reflect.deleteProperty(course, "__v");
    });
    return res.json({
      message: "اطلاعات با موفقیت دریافت شد",
      allCourses,
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
 * /api/course/{slug}:
 *   get:
 *     summary: دریافت اطلاعات یک دوره بوسیله آدرس مربوطه
 *     tags: [course]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: آدرس دوره مورد نظر
 *         example: "node-js"
 *     responses:
 *       200:
 *         description: اطلاعات با موفقیت دریافت شد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "اطلاعات با موفقیت دریافت شد"
 *                 categoryObj:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                     slug:
 *                       type: string
 *                     description:
 *                       type: string
 *                     category:
 *                       type: string
 *                     author:
 *                       type: string
 *                     coverImage:
 *                       type: string
 *                     level:
 *                       type: string
 *                     status:
 *                       type: string
 *                     prerequisites:
 *                       type: array
 *                       items:
 *                         type: string
 *                     rating:
 *                       type: number
 *                     commentCount:
 *                       type: number
 *       404:
 *         description: دوره مورد نظر پیدا نشد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "دوره مورد نظر پیدا نشد"
 */

exports.getCourseBySlug = async (req, res) => {
  try {
    const slug = req.params.slug;
    const findCourseBySlug = await courseModel.findOne({ slug });
    if (findCourseBySlug) {
      const courseObj = findCourseBySlug.toObject();
      Reflect.deleteProperty(courseObj, "createdAt");
      Reflect.deleteProperty(courseObj, "updatedAt");
      Reflect.deleteProperty(courseObj, "_id");
      Reflect.deleteProperty(courseObj, "__v");
      return res.json({
        message: "اطلاعات با موفقیت دریافت شد",
        courseObj,
      });
    } else {
      return res.status(404).json({
        message: "دوره مورد نظر پیدا نشد",
      });
    }
  } catch (e) {
    return res.status(500).json({
      message: "internal server error",
      error: e.message,
    });
  }
};

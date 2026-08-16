const categoryModel = require("./../../admin/course/category/categoryModel");
const userModel = require("./../../user/auth/userModel");

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: دریافت دسته بندی‌ها
 *     tags: [Category]
 *     parameters:
 *       - in: query
 *         name: authorId
 *         schema: { type: string }
 *         description: آیدی نویسنده (اختیاری)
 *     responses:
 *       200:
 *         description: دریافت موفقیت آمیز اطلاعات دسته بندی ها
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
 *                     name:
 *                       type: string
 *                     slug:
 *                       type: string
 *                     courses:
 *                       type: number
 *                     educationalArticles:
 *                       type: number
 *                     author:
 *                       type: number
 *       404:
 *         message:
 *           description: دریافت موفقیت آمیز اطلاعات دسته بندی ها
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "دسته بندی پیدا نشد"
 */
exports.getAllOrByAthorId = async (req, res) => {
  try {
    const { authorId } = req.query;
    const isUserExists = await userModel.findOne({ userid: authorId });
    if (isUserExists) {
      const findCategoryByAuthorId = await categoryModel
        .find({
          author: isUserExists._id,
        })
        .lean();
      if (findCategoryByAuthorId) {
        findCategoryByAuthorId.forEach((cat) => {
          Reflect.deleteProperty(cat, "createdAt");
          Reflect.deleteProperty(cat, "updatedAt");
          Reflect.deleteProperty(cat, "author");
          Reflect.deleteProperty(cat, "_id");
          Reflect.deleteProperty(cat, "__v");
        });
        return res.json({
          message: "اطلاعات با موفقیت دریافت شد",
          findCategoryByAuthorId,
        });
      } else {
        return res.status(404).json({
          message: "دسته بندی پیدا نشد",
        });
      }
    } else {
      const categories = await categoryModel
        .find()
        .select("name slug author courses educationalArticles")
        .lean();
      if (categories.length) {
        return res.json({
          message: "اطلاعات با موفقیت دریافت شد",
          categories,
        });
      } else {
        return res.status(404).json({
          message: "دسته بندی پیدا نشد",
        });
      }
    }
  } catch (e) {
    if (e) {
      return res.status(500).json({
        message: "internal server error",
        error: e.message,
      });
    }
  }
};

/**
 * @swagger
 * /api/categories/{slug}:
 *   get:
 *     summary: دریافت اطلاعات یک دسته بندی بوسیله آدرس دسته بندی
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: آدرس دسته بندی
 *         example: "programming"
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
 *                     name:
 *                       type: string
 *                     slug:
 *                       type: string
 *                     students:
 *                       type: number
 *                     courses:
 *                       type: number
 *                     educationalArticles:
 *                       type: number
 *       404:
 *         description: دسته بندی پیدا نشد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "دسته بندی پیدا نشد"
 */
exports.getBySlug = async (req, res) => {
  try {
    const slug = req.params.slug;
    const findCategoryBySlug = await categoryModel
      .findOne({ slug })
      .select("-createdAt -updatedAt -__v");
    if (findCategoryBySlug) {
      return res.json({
        message: "اطلاعات با موفقیت دریافت شد",
        categoryObj: findCategoryBySlug,
      });
    } else {
      return res.status(404).json({
        message: "دسته بندی پیدا نشد",
      });
    }
  } catch (e) {
    return res.status(500).json({
      message: "internal server error",
      error: e.message,
    });
  }
};

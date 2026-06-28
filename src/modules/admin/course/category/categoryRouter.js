const express = require("express");
const {
  createCategory,
  editCategory,
  deleteCategory,
  getAllCategoryByAuthor,
} = require("./categoryController.js");
const validator = require("../../../../middlewares/validator.js");
const {
  categoryValidationSchema,
  categoryUpdateValidationSchema,
} = require("../../../../utils/validators/categoryValidator.js");

const router = express.Router();

/**
 * @swagger
 * /api/admin/categories/create:
 *   post:
 *     summary: ایجاد دسته بندی
 *     tags: [Category]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: نام دسته بندی
 *                 example: "فرانت اند"
 *               slug:
 *                 type: string
 *                 description: آدرس دسته بندی
 *                 example: "front-end"
 *             required:
 *               - name
 *               - slug
 *     responses:
 *       201:
 *         description: اضافه شدن موفقیت آمیز دسته بندی
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "دسته بندی جدید با موفقیت اضافه شد"
 *                 user:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     slug:
 *                       type: string
 *       409:
 *         description: تکراری بودن نام دسته بندی یا آدرس دسته بندی
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "نام دسته بندی یا آدرس دسته بندی تکراری میباشد"
 *       401:
 *         description: کاربر احراز هویت نشده است
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "لطفا اول نسبت به احراز هویت اقدام نمایید"
 */
router.post("/create", validator(categoryValidationSchema), createCategory);

/**
 * @swagger
 * /api/admin/categories/edit:
 *   put:
 *     summary: ویرایش دسته بندی
 *     tags: [Category]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               newName:
 *                 type: string
 *                 description: نام جدید دسته بندی
 *                 example: "فرانت اند"
 *               newSlug:
 *                 type: string
 *                 description: آدرس جدید دسته بندی
 *                 example: "back-end"
 *               oldSlug:
 *                 type: string
 *                 description: آدرس پیشین دسته بندی
 *                 example: "front-end"
 *             required:
 *               - newName
 *               - newSlug
 *               - oldSlug
 *     responses:
 *       200:
 *         description: ویرایش شدن موفقیت آمیز دسته بندی
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "دسته بندی جدید با موفقیت ویرایش شد"
 *       409:
 *         description: تکراری بودن نام دسته بندی یا آدرس دسته بندی
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "نام دسته بندی یا آدرس دسته بندی تکراری میباشد"
 *       404:
 *         description: پیدا نشدن دسته بندی
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "دسته بندی پیدا نشد"
 *       401:
 *         description: کاربر احراز هویت نشده است
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "لطفا اول نسبت به احراز هویت اقدام نمایید"
 *       403:
 *         description: سازنده این دسته بندی این کاربر نیست و نمیتواند آنرا ویرایش کند
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "شما قادر به ویرایش این دسته بندی نخواهید بود"
 */
router.put("/edit", validator(categoryUpdateValidationSchema), editCategory);

/**
 * @swagger
 * /api/admin/categories/delete:
 *   delete:
 *     summary: حذف دسته بندی
 *     tags: [Category]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: ObjectId
 *                 description: شناسه دسته بندی مورد نظر
 *                 example: "65f2a1b3c4d5e6f7a8b9c0d1"
 *             required:
 *               - id
 *     responses:
 *       200:
 *         description: حذف موفق
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "دسته بندی شما با موفقیت حذف شد"
 *       404:
 *         description: پیدا نشدن دسته بندی
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "دسته بندی پیدا نشد"
 *       401:
 *         description: کاربر احراز هویت نشده است
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "لطفا اول نسبت به احراز هویت اقدام نمایید"
 *       403:
 *         description: سازنده این دسته بندی این کاربر نیست و نمیتواند آنرا حذف کند
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "شما قادر به حذف این دسته بندی نخواهید بود"
 */      
router.delete("/delete", deleteCategory);

/**
 * @swagger
 * /api/admin/categories/:
 *   get:
 *     summary: دریافت اطلاعات تمامی دسته بندی های ساخته شده توسط کاربر
 *     tags: [Category]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: دریافت موفقیت آمیز اطلاعات تمامی دسته بندی ها
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
 *                       type: string
 *                     educationalArticles:
 *                       type: string
 *                     author:
 *                       type: string
 *       404:
 *         description: پیدا نشدن دسته بندی ساخته شده توسط کاربر
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "در حال حاضر دسته بندی ای مربوط به شما برای نمایش وجود ندارد"       
 *       401:
 *         description: کاربر احراز هویت نشده
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "لطفا اول نسبت به احراز هویت اقدام نمایید"
 */
router.get("/", getAllCategoryByAuthor);

module.exports = router;

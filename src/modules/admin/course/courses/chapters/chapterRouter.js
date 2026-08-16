const express = require("express");
const {
  createChapter,
  editChapter,
  deleteChapter,
  getAllChapterByAuthor,
} = require("./chapterController");
const {
  chapterValidationSchema,
  chapterUpdateValidationSchema,
} = require("./../../../../../utils/validators/chapterValidator");
const validator = require("./../../../../../middlewares/validator");

const router = express.Router();

/**
 * @swagger
 * /api/admin/chapters/create:
 *   post:
 *     summary: افزودن دوره
 *     tags: [Chapter]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: عنوان فصل
 *                 example: "نصب پایتون"
 *               course:
 *                 type: string
 *                 format: ObjectId
 *                 description: شناسه دوره مورد نظر برای اضافه کردن فصل
 *                 example: "65f2a1b3c4d5e6f7a8b9c0d1"
 *             required:
 *               - title
 *               - course
 *     responses:
 *       201:
 *         description: افزودن موفق فصل
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "فصل شما با موفقیت ساخته شد"
 *                 courseObj:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                     course:
 *                       type: string
 *       409:
 *         description: تکراری بودن عنوان فصل
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "عنوان فصل تکراری میباشد"
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
 *         description: دوره ای با این شناسه وجود ندارد یا کاربر نویسنده آن دوره نیست
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "دوره ای با این اطلاعات وجود ندارد یا شما نویسنده این دوره نیستید"
 */

router.post("/create", validator(chapterValidationSchema), createChapter);

/**
 * @swagger
 * /api/admin/chapters/edit:
 *   put:
 *     summary: ویرایش دوره
 *     tags: [Chapter]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               newTitle:
 *                 type: string
 *                 description: عنوان جدید فصل
 *                 example: "نصب پایتون"
 *               chapterId:
 *                 type: string
 *                 format: ObjectId
 *                 description: شناسه فصل مورد نظر برای ویرایش فصل
 *                 example: "65f2a1b3c4d5e6f7a8b9c0d1"
 *             required:
 *               - newTitle
 *               - chapterId
 *     responses:
 *       200:
 *         description: ویرایش موفق فصل
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "فصل شما با موفقیت ویرایش شد"
 *       409:
 *         description: تکراری بودن عنوان فصل
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "فصلی با این مشخصات وجود دارد"
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
 *       404:
 *         description: پیدا نشدن فصل 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "فصلی با این مشخصات پیدا نشد"
 */

router.put("/edit", validator(chapterUpdateValidationSchema), editChapter);

/**
 * @swagger
 * /api/admin/chapters/delete:
 *   delete:
 *     summary: حذف فصل
 *     tags: [Chapter]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: ObjectId
 *         description: شناسه دوره مورد نظر
 *         example: "65f2a1b3c4d5e6f7a8b9c0d1"
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
 *                   example:  "فصل شما با موفقیت حذف شد"
 *       404:
 *         description: پیدا نشدن فصل
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "فصلی با این مشخصات پیدا نشد"
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

router.delete("/delete", deleteChapter);

/**
 * @swagger
 * /api/admin/chapters/:
 *   get:
 *     summary: دریافت اطلاعات تمامی فصل های مرتبط با نویسنده آن
 *     tags: [Chapter]
 *     security:
 *       - sessionAuth: []
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


router.get("/", getAllChapterByAuthor);

module.exports = router;

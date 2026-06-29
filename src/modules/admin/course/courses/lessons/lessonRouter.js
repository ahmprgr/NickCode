const express = require("express");
const {
  createLesson,
  editLesson,
  deleteLesson,
  getAllLessonsByAuthor,
} = require("./lessonController");
const {
  lessonsValidationSchema,
  lessonsUpdateValidationSchema,
} = require("./../../../../../utils/validators/lessonValidator");
const validator = require("./../../../../../middlewares/validator");

const router = express.Router();

/**
 * @swagger
 * /api/admin/lessons/create:
 *   post:
 *     summary: افزودن درس
 *     tags: [Lesson]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: عنوان درس
 *                 example: "نصب پایتون"
 *               slug:
 *                 type: string
 *                 description: آدرس درس
 *                 example: "install-python"
 *               content:
 *                 type: string
 *                 description: محتوای درس
 *                 example: "Ut suscipit autem. Veritatis dolor ut rerum esse ea. Et voluptas cupiditate ut accusantium perferendis eos fuga et rerum. Quo aut molestias aliquid. Voluptas maxime quasi excepturi sit sint. Sequi quibusdam cum ut ipsam nihil voluptate.Vitae voluptas odit eos consequatur fugit. Totam delectus sint dolor praesentium consequuntur dolor numquam. Porro illo iste voluptatem. Autem sint ad repudiandae.Magnam sed qui nisi rerum facere recusandae voluptatum laudantium aspernatur. Non cum illum enim perspiciatis qui sapiente vel nisi. Quia voluptas enim suscipit delectus vero aut esse dolorem at. Voluptate doloremque non vel dolor mollitia fugiat a illo. Natus perferendis esse natus.Aspernatur qui cumque temporibus architecto est qui odit ab nesciunt. In rerum iusto velit dolores. Soluta ut ipsa ipsum. Dicta odit totam assumenda nulla aut aut. Velit et rem. Voluptatem est et quis sit voluptatem consequatur doloremque ut.Voluptatum aspernatur rerum sit fugiat. Qui velit et sed qui commodi. Adipisci et saepe aut ut esse dolores aut ad. Consequuntur quaerat beatae ut recusandae quae.Et ab laborum reiciendis dolorem ut. Distinctio velit voluptatem eius molestiae et eos impedit. Et placeat dolore eligendi. Reiciendis eveniet nam."
 *               chapter:
 *                 type: string
 *                 description: شناسه فصل مورد نظر
 *                 example: "6a26e38a25f4845405da900d"
 *             required:
 *               - title
 *               - slug
 *               - content
 *               - chapter
 *     responses:
 *       201:
 *         description: افزودن موفق درس
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "درس جدید با موفقیت ساخته شد"
 *                 lessonObj:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                     slug:
 *                       type: string
 *                     content:
 *                       type: string
 *       409:
 *         description: تکراری بودن عنوان درس یا آدرس آن
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "آدرس درس یا عنوان آن تکراری میباشد"
 *       403:
 *         description: عدم توانایی ایجاد درس 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "شما قادر به ایجاد درس برای این دوره نخواهید بود"
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

router.post("/create", validator(lessonsValidationSchema), createLesson);

/**
 * @swagger
 * /api/admin/lessons/edit:
 *   put:
 *     summary: ویرایش درس
 *     tags: [Lesson]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               newTitle:
 *                 type: string
 *                 description: عنوان درس
 *                 example: "نصب پایتون"
 *               newSlug:
 *                 type: string
 *                 description: آدرس درس
 *                 example: "install-python"
 *               newContent:
 *                 type: string
 *                 description: محتوای درس
 *                 example: "Ut suscipit autem. Veritatis dolor ut rerum esse ea. Et voluptas cupiditate ut accusantium perferendis eos fuga et rerum. Quo aut molestias aliquid. Voluptas maxime quasi excepturi sit sint. Sequi quibusdam cum ut ipsam nihil voluptate.Vitae voluptas odit eos consequatur fugit. Totam delectus sint dolor praesentium consequuntur dolor numquam. Porro illo iste voluptatem. Autem sint ad repudiandae.Magnam sed qui nisi rerum facere recusandae voluptatum laudantium aspernatur. Non cum illum enim perspiciatis qui sapiente vel nisi. Quia voluptas enim suscipit delectus vero aut esse dolorem at. Voluptate doloremque non vel dolor mollitia fugiat a illo. Natus perferendis esse natus.Aspernatur qui cumque temporibus architecto est qui odit ab nesciunt. In rerum iusto velit dolores. Soluta ut ipsa ipsum. Dicta odit totam assumenda nulla aut aut. Velit et rem. Voluptatem est et quis sit voluptatem consequatur doloremque ut.Voluptatum aspernatur rerum sit fugiat. Qui velit et sed qui commodi. Adipisci et saepe aut ut esse dolores aut ad. Consequuntur quaerat beatae ut recusandae quae.Et ab laborum reiciendis dolorem ut. Distinctio velit voluptatem eius molestiae et eos impedit. Et placeat dolore eligendi. Reiciendis eveniet nam."
 *               lesson:
 *                 type: string
 *                 description: شناسه درس مورد نظر
 *                 example: "6a26e38a25f4845405da900d"
 *             required:
 *               - newTitle
 *               - newSlug
 *               - newContent
 *               - lesson
 *     responses:
 *       200:
 *         description: ویرایش موفق درس
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "درس جدید با موفقیت ویرایش شد"
 *       409:
 *         description: تکراری بودن عنوان درس یا آدرس آن
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "آدرس درس یا عنوان آن تکراری میباشد"
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
 *         description: عدم توانایی ویرایش درس
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "شما قادر به ویرایش درس برای این دوره نخواهید بود"
 */

router.put("/edit", validator(lessonsUpdateValidationSchema), editLesson);

/**
 * @swagger
 * /api/admin/lessons/delete:
 *   delete:
 *     summary: حذف درس
 *     tags: [Lesson]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: ObjectId
 *         description: شناسه درس مورد نظر
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
 *                   example:  "درس شما با موفقیت حذف شد"
 *       404:
 *         description: پیدا نشدن درس
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "درسی با این مشخصات پیدا نشد"
 *       403:
 *         description: عدم توانایی حذف درس
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "شما قادر به حذف درس برای این دوره نخواهید بود"
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

router.delete("/delete", deleteLesson);

/**
 * @swagger
 * /api/admin/lessons/:
 *   get:
 *     summary: دریافت اطلاعات تمامی درس های مرتبط با فصل آن
 *     tags: [Lesson]
 *     security:
 *       - sessionAuth: []
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

router.get("/", getAllLessonsByAuthor);

module.exports = router;

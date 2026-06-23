const express = require("express");
const {
  createCourse,
  editCourse,
  deleteCourse,
  getAllCourseByCurrentAuthor,
} = require("./coursesController");
const upload = require("./../../../../middlewares/upload/imgUploader");
const {
  courseValidationSchema,
  courseUpdateValidationSchema,
} = require("./../../../../utils/validators/courseValidator");
const validator = require("./../../../../middlewares/validator");

const router = express.Router();

/**
 * @swagger
 * /api/admin/courses/create:
 *   post:
 *     summary: افزودن دوره
 *     tags: [course]
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
 *                 description: عنوان دوره
 *                 example: "آموزش پایتون"
 *               slug:
 *                 type: string
 *                 description: آدرس دوره
 *                 example: "python"
 *               description:
 *                 type: string
 *                 description: توضیحات دوره
 *                 example: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد. در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها و شرایط سخت تایپ به پایان رسد وزمان مورد نیاز شامل حروفچینی دستاوردهای اصلی و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد"
 *               coverImage:
 *                 type: string
 *                 format: binary
 *                 description: عکس پروفایل
 *               prerequisites:
 *                 type: string
 *                 description: پیشنیازها
 *                 example: "python,php,js"
 *               category:
 *                 type: string
 *                 description: شناسه دوره مورد نظر
 *                 example: "6a26e38a25f4845405da900d"
 *             required:
 *               - title
 *               - slug
 *               - description
 *               - coverImage
 *               - prerequisites
 *               - category
 *     responses:
 *       201:
 *         description: افزودن موفق دوره
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "دوره جدید با موفقیت ساخته شد"
 *                 courseObj:
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
 *       409:
 *         description: تکراری بودن عنوان دوره یا آدرس دوره
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "آدرس دوره یا عنوان آن تکراری میباشد"
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

router.post(
  "/create",
  upload.single("coverImage"),
  validator(courseValidationSchema),
  createCourse,
);

/**
 * @swagger
 * /api/admin/courses/edit:
 *   put:
 *     summary: ویرایش دوره
 *     tags: [course]
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
 *                 description: عنوان دوره
 *                 example: "آموزش پایتون"
 *               newSlug:
 *                 type: string
 *                 description: آدرس دوره
 *                 example: "python"
 *               newDescription:
 *                 type: string
 *                 description: توضیحات دوره
 *                 example: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد. در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها و شرایط سخت تایپ به پایان رسد وزمان مورد نیاز شامل حروفچینی دستاوردهای اصلی و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد"
 *               coverImage:
 *                 type: string
 *                 format: binary
 *                 description: عکس پروفایل
 *               newPrerequisites:
 *                 type: string
 *                 description: پیشنیازها
 *                 example: "python,php,js"
 *               newCategory:
 *                 type: string
 *                 description: شناسه دوره مورد نظر
 *                 example: "6a26e38a25f4845405da900d"
 *               oldSlug:
 *                 type: string
 *                 description: "آدرس قدیمی دوره"
 *             required:
 *               - newTitle
 *               - newSlug
 *               - newDescription
 *               - coverImage
 *               - newPrerequisites
 *               - newCategory
 *               - oldSlug
 *     responses:
 *       201:
 *         description: ویرایش موفق دوره
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "دوره با موفقیت ویرایش شد"
 *       409:
 *         description: تکراری بودن عنوان دوره یا آدرس دوره
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "آدرس دوره یا عنوان آن تکراری میباشد"
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

router.put(
  "/edit",
  upload.single("coverImage"),
  validator(courseUpdateValidationSchema),
  editCourse,
);

/**
 * @swagger
 * /api/admin/courses/delete:
 *   delete:
 *     summary: حذف دوره
 *     tags: [course]
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
 *                   example: "دوره شما با موفقیت حذف شد"
 *       404:
 *         description: پیدا نشدن دوره
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "دوره پیدا نشد"
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

router.delete("/delete", deleteCourse);

/**
 * @swagger
 * /api/admin/courses/:
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
 *       404:
 *         description: پیدا نشدن دوره مرتبط
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "در حال حاضر دوره ای برای نشان دادن وجود ندارد"       
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

router.get("/", getAllCourseByCurrentAuthor);

module.exports = router;

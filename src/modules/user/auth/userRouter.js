const express = require("express");
const {
  userUpdateValidationSchema,
  userValidationSchema,
} = require("./../../../utils/validators/authValidator");
const validator = require("./../../../middlewares/validator");
const authGuard = require("../../../middlewares/authGuard");
const uploader = require("../../../middlewares/upload/imgUploader");

const {
  deleteAccount,
  editProfile,
  register,
  login,
  logout,
  getMe,
} = require("./userController");

const router = express.Router();

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: دریافت اطلاعات کاربر جاری
 *     tags: [Auth]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: موفق - اطلاعات کاربر دریافت شد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     fullname:
 *                       type: string
 *                     email:
 *                       type: string
 *                     userid:
 *                       type: string
 *                     profile:
 *                       type: string
 *                     role:
 *                       type: string
 *       401:
 *         description: خطا - کاربر احراز هویت نشده
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "لطفا اول نسبت به احراز هویت اقدام نمایید"
 */
router.get("/me",getMe)

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: ثبت نام در نیک کد
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *                 description: نام کامل
 *                 example: "تقی دهستانی"
 *               email:
 *                 type: string
 *                 description: پست الکترونیکی
 *                 example: "your.email@site.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 description: (حداقل 8 کاراکتر) رمز عبور
 *                 example: "12345678"
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 example: "12345678"
 *                 description: تکرار رمز عبور
 *             required:
 *               - fullname
 *               - email
 *               - password
 *               - confirmPassword
 *     responses:
 *       201:
 *         description: ثبت نام با موفقیت انجام شد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     fullname:
 *                       type: string
 *                     email:
 *                       type: string
 *                     userid:
 *                       type: string
 *                     profile:
 *                       type: string
 *                     role:
 *                       type: string
 *       422:
 *         description: عدم تطابق رمز عبور با فیلد تکرار
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "رمز عبور با فیلد تکرار تطابق ندارد"
 *       409:
 *         description: تکراری بودن ایمیل
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "این ایمیل تکراری میباشد"
 *       403:
 *         description: شما قبلا احراز هویت شده بوده اید
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "شما از قبل احراز هویت شده بوده اید"
 */
router.post("/register", validator(userValidationSchema), register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: ورود به نیک کد
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: پست الکترونیکی
 *                 example: "your.email@site.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 description: رمز عبور
 *                 example: "12345678"
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: ورود موفقیت آمیز
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "ورود موفقیت آمیز بود"
 *       422:
 *         description: عدم وجود کاربری با این مشخصات
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "کاربری با این مشخصات وجود ندارد"
 *       403:
 *         description: کاربر در حال حاضر احراز هویت شده است
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "شما از قبل احراز هویت شده بوده اید"
 */
router.post("/login", login);

/**
 * @swagger
 * /api/auth/editprofile:
 *   put:
 *     summary: ویرایش پروفایل کاربر
 *     tags: [Auth]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               newFullname:
 *                 type: string
 *                 description: نام کامل
 *                 example: "تقی دهستانی"
 *               newEmail:
 *                 type: string
 *                 description: پست الکترونیکی
 *                 example: "new.email@site.com"
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 description: رمز عبور
 *                 example: "12345678"
 *               profile:
 *                 type: string
 *                 format: binary
 *                 description: عکس پروفایل
 *               userId:
 *                 type: string
 *                 description: آیدی کاربری جدید
 *                 example: "taghi_2024"
 *     responses:
 *       200:
 *         description: بروزرسانی موفق
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "پروفایل با موفقیت بروزرسانی شد"
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
 *       409:
 *         description: ایمیل یا شناسه کاربری تکراری است
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "شناسه کاربری یا ایمیل تکراری میباشد"
 */
router.put(
  "/editprofile",
  authGuard,
  uploader.single("profile"),
  validator(userUpdateValidationSchema),
  editProfile,
);

/**
 * @swagger
 * /api/auth/deleteaccount:
 *   delete:
 *     summary: حذف حساب کاربری
 *     tags: [Auth]
 *     security:
 *       - sessionAuth: []
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
 *                   example: "حساب کاربری شما با موفقیت حذف شد"
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
router.delete("/deleteaccount", deleteAccount);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: خروج از حساب کاربری
 *     tags: [Auth]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: خروج موفق
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "شما با موفقیت خارج شده اید"
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
router.post("/logout", logout);

module.exports = router;

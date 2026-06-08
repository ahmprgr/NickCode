const express = require("express");
const helmet = require("helmet");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");
const authRouter = require("./modules/user/auth/userRouter.js");
const isAdmin = require("./middlewares/isAdmin.js");
const authGuard = require("./middlewares/authGuard.js");
const { secretKey, dbURI } = require("./../configs/env.js");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./../configs/swagger.js");
const categoryRouter = require("./modules/admin/course/category/categoryRouter.js");
const categoryModel = require("./modules/admin/course/category/categoryModel.js");
const userModel = require("./modules/user/auth/userModel.js");

const app = express();

//* middlewares
app.use(cookieParser());
app.use(
  session({
    secret: secretKey,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 36,
      httpOnly: true,
      secure: false,
    },
    store: MongoStore.create({
      mongoUrl: dbURI,
      ttl: 60 * 60 * 36,
      autoRemove: "native",
    }),
  }),
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(helmet());
//* swagger
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//* router
app.use("/api/auth", authRouter);
app.use("/api/admin/categories", authGuard, isAdmin, categoryRouter);

//* get all categories, by slug and by author
//get all and by author
app.get("/api/categories", async (req, res) => {
  try {
    const { authorId } = req.query;
    const isUserExists = await userModel.findOne({ userid: authorId });
    if (isUserExists) {
      const findCategoryByAuthorId = await categoryModel.find({
        author: isUserExists._id,
      }).lean();
      if (findCategoryByAuthorId) {
        findCategoryByAuthorId.forEach((cat) => {
          Reflect.deleteProperty(cat, "createdAt");
          Reflect.deleteProperty(cat, "updatedAt");
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
      const categories = await categoryModel.find().lean();
      if (categories.length) {
        categories.forEach((cat) => {
          Reflect.deleteProperty(cat, "createdAt");
          Reflect.deleteProperty(cat, "updatedAt");
          Reflect.deleteProperty(cat, "_id");
          Reflect.deleteProperty(cat, "__v");
        });
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
});

//by slug
app.get("/api/categories/:slug", async (req, res) => {
  try {
    const slug = req.params.slug;
    const findCategoryBySlug = await categoryModel.findOne({ slug });
    if (findCategoryBySlug) {
      const categoryObj = findCategoryBySlug.toObject();
      Reflect.deleteProperty(categoryObj, "createdAt");
      Reflect.deleteProperty(categoryObj, "updatedAt");
      Reflect.deleteProperty(categoryObj, "_id");
      Reflect.deleteProperty(categoryObj, "__v");
      return res.json({
        message: "اطلاعات با موفقیت دریافت شد",
        categoryObj,
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
});

module.exports = app;

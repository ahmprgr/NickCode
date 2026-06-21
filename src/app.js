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
const {
  getAllOrByAthorId,
  getBySlug,
} = require("./publicFuncs/getCategory.js");
const { getCourses, getCourseBySlug } = require("./publicFuncs/getCourse.js");
const courseRouter = require("./modules/admin/course/courses/coursesRouter.js");
const path = require("path");

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
app.use(
  "/api/uploads",
  express.static(path.join(__dirname, "public", "uploads")),
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(helmet());
//* swagger
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//* router
app.use("/api/auth", authRouter);
app.use("/api/admin/categories", authGuard, isAdmin, categoryRouter);
app.use("/api/admin/courses", authGuard, isAdmin, courseRouter);
//* public endpoints
//get category
app.get("/api/categories", getAllOrByAthorId);
app.get("/api/categories/:slug", getBySlug);
app.get("/api/courses/",getCourses)
app.get("/api/courses/:slug",getCourseBySlug)

module.exports = app;

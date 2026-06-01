const express = require("express");
const helmet = require("helmet");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");
const authRouter = require("./modules/user/auth/userRouter.js");
const userController = require("./modules/user/auth/userController");
const isAdmin = require("./middlewares/isAdmin.js");
const authGuard = require("./middlewares/authGuard.js");
const courseRouter = require("./modules/admin/courses/courseRouter.js");
const courseController = require("./modules/admin/courses/courseController.js");
const { secretKey, dbURI } = require("./../configs/env.js")
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require("./../configs/swagger.js");

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
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(helmet());
//swagger
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//* router
app.use("/api/auth", authRouter);
app.use("/api/admin",courseRouter)
app.get("/api/user/me",authGuard,userController.getMe)
app.get("/api/courses/:slug",courseController.getOneCourse)
app.get("/api/courses",courseController.getCourse)

module.exports = app;

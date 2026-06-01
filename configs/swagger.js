const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Nick Code",
      version: "1.0.0",
      description:
        "A website where can learn programming with persian language",
      contact: {
        name: "ahmprgr",
        email: "ahm.prgr.01bin.dev.89@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:1404",
        description: "localserver",
      },
    ],
  },
  apis: [
    "./../src/modules/admin/courses/courseRouter.js",
    "./../src/modules/user/auth/userRouter.js",
  ],
};

module.exports = swaggerJsdoc(options);

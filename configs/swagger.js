const path = require("path")
const swaggerJsdoc = require("swagger-jsdoc");

const rootPath = path.resolve(__dirname, "../");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Nick Code",
      version: "0.0.1",
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
    path.join(rootPath, "src/modules/**/*.js")
  ],
};

module.exports = swaggerJsdoc(options);

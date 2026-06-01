const dotenv = require("dotenv").config();

const port = process.env.PORT;
const dbURI = process.env.MONGO_DB_URI;
const secretKey = process.env.SECRET

module.exports = { port, dbURI, secretKey };

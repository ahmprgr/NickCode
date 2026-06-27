const dotenv = require("dotenv").config();

const port = process.env.PORT;
const dbURI = process.env.MONGO_DB_URI;
const secretKey = process.env.SECRET;
const adminStaticApiUrl = process.env.ADMIN_STATIC_API_URL;

module.exports = { port, dbURI, secretKey, adminStaticApiUrl };

const mongoose = require("mongoose");
const { dbURI } = require("./env")
async function runDB() {
  try {
    await mongoose.connect(dbURI);
    console.log("DB connected successfuly");
  } catch (e) {
    console.error(e.message);
  }
}
module.exports = runDB;

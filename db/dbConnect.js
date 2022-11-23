// external imports
const mongoose = require("mongoose");
require("dotenv").config();

async function dbConnect() {
  // connecting mongodb database with the help of DB_URL string in .env file
  mongoose
    .connect(process.env.DB_URL, {
      // these are the option to ensure that connections is done properly.
      // From the Mongoose 6.0 docs:
      // useNewUrlParser, useUnifiedTopology, useFindAndModify, and useCreateIndex are no longer supported options. Mongoose 6 always behaves as if useNewUrlParser, useUnifiedTopology, and useCreateIndex are true, and useFindAndModify is false. Please remove these options from your code.
      // Read more: https://stackoverflow.com/questions/68958221/mongoparseerror-options-usecreateindex-usefindandmodify-are-not-supported
      // Code
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // useCreateIndex: true,
      // useFindAndModify: true,
      // useCreateIndex: true,
    })
    .then(() => {
      console.log("Successfully connected to the Mongodb Atlas!");
    })
    .catch((error) => {
      console.log("Unable to connect to Mongodb Atlas!");
      console.log(error);
    });
}

module.exports = dbConnect;

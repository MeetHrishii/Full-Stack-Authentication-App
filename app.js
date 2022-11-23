const bcrypt = require("bcrypt");
// require jwt (jasonwebtoken)
const jwt = require("jsonwebtoken");
// require database connection
const dbConnect = require("./db/dbConnect");
// importing/requiring usermodel
const user = require("./db/userModel");
// execute database connection
dbConnect();

const express = require("express");
const app = express();
const bodyParser = require("body-parser");

// body parser configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (request, response, next) => {
  response.json({ message: "Hey! This is your server response!" });
  next();
});

// Creating register Endpoint
app.post("/register", (request, response) => {
  // Hashing the password before saving the email and password
  bcrypt
    .hash(request.body.password, 10)
    .then((hashedpassword) => {
      // create a new user instance and collect the data
      const user = new User({
        email: request.body.email,
        password: hashedpassword,
      });

      // Saving the new user
      user
        .save()
        // return the success if the new user is added to the database
        .then((result) => {
          response.status(201).send({
            message: "User created Successfully.",
            result,
          });
        })
        // catch error if the new user wasn't added successfully
        .catch((error) => {
          response.status(500).send({
            message: "Error Creating user",
            error,
          });
        });
    })
    // catch erro if the password has isn't successful
    .catch((e) => {
      response.status(500).send({
        message: "Password was not hashed successfully",
        e,
      });
    });
});



module.exports = app;

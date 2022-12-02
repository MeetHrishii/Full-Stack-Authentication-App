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

// Handle CORS Errors
// curb cores Error by addding a header here
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});


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

// Creating Login Endpoint
app.post("/login", (request, response) => {
  // Checking if the email that the user enters on login exists
  // Using a then...catch... block to check if the email search
  // above was successful or not. If it is unsuccessful, capture
  // that in the catch block. If successful, compare the password
  //  entered with the hashed password in the database.
  User.findOne({ email: request.body.email })
    .then((user) => {
      bcrypt
        .compare(request.body.password, user.password)
        .then((passwordCheck) => {
          // check if password matches
          if (!passwordCheck) {
            return response.status(400).send({
              message: "Passwords does not match",
              error,
            });
          }
          // if the password matches, generate a random token with the
          // jwt.sign() function. It takes 3 parameters:
          // jwt.sign(payload, secretOrPrivateKey, [options, callback])
          // Read more: https://www.npmjs.com/package/jsonwebtoken#usage
          const token = jwt.sign(
            {
              userId: user._id,
              userEmail: user.email,
            },
            "RANDOM-TOKEN",
            { expiresIn: "24h" }
          );

          // return success response
          response.status(200).send({
            message: "Login Successful",
            email: user.email,
            token,
          });
        })
        .catch((error) => {
          response.status(400).send({
            message: "Passwords does not match",
            error,
          });
        });
    })
    .catch((e) => {
      response.status(404).send({
        message: "Email not found",
        e,
      });
    });
});

// free endpoint
app.get("/free-endpoint", (request, response) => {
  response.json({ message: "You are free to access me anytime" });
});

// authentication endpoint
const auth = require("./auth");
const { reset } = require("nodemon");
app.get("/auth-endpoint", auth, (request, response) => {
  response.json({ message: "You are authorized to access me" });
});

module.exports = app;

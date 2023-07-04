const express = require("express");
const port = 8000;
const app = express();

const expressLayout = require("express-ejs-layouts");

// DataBase
const db = require("./config/mongoose");

const bodyParser = require("body-parser");

// Creating session
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local");

const MongoStore = require("connect-mongo");

// showing action notifications
const flash = require("connect-flash");
const flashMiddleWare = require("./config/flashMiddleware");

app.use(bodyParser.urlencoded({ extended: false }));
// Static Folders
app.use(express.static("./assets"));

// Setting up the view engine
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(expressLayout);

// mongo store is used to store the session cookie in the db
app.use(
  session({
    name: "ERS",
    secret: "employeeReviewSystem",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: MongoStore.create(
      {
        mongoUrl: "mongodb://localhost/ers_development",
        autoRemove: "disabled",
      },
      (err) => {
        console.log(err || "connect-mongo setup ok");
      }
    ),
  })
);

// Using passport
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

// Using Connect flash
app.use(flash());
app.use(flashMiddleWare.setFlash);

app.use("/", require("./routes/index"));

// Setting up the server at the given port
app.listen(port, function (err) {
  if (err) {
    console.log("Error in running the app.");
    return;
  }
  console.log("Server is up and running at port ", port);
});

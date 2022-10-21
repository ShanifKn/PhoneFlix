const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3000;
const LoginPage = require("./routes/authorization");
const adminPage = require("./routes/admin");
const hbs = require("express-handlebars");
const fileupload = require("express-fileupload");
const db = require("../PhoneFlix/config/connection");
const logger = require("morgan");
const session = require("express-session");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.engine(
  "hbs",
  hbs.engine({
    layoutsDir: __dirname + "/views/layouts",
    extname: "hbs",
    defaultLayout: "layout",
    partialsDir: __dirname + "/views/layouts/partials/",
  })
);

app.use(logger("dev"));
app.use(fileupload());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
// MOngo configuration
db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Connect success");
  }
});

// Session Cookie:
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3000 * 90 * 60 },
  })
);
// Cache:
app.use((req, res, next) => {
  res.set(
    "Cache-control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  next();
});

//Route..
app.use("/", LoginPage);
app.use("/admin", adminPage);

app.listen(PORT, (req, res) => {
  console.log("Server is Running!!!!");
});

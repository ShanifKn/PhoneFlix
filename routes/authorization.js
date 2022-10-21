const express = require("express");
const router = express.Router();
const product = require("../Setup/product");
const SignIn = require("../Setup/auth");
const LogIn = require("../Setup/auth");

router.get("/", (req, res) => {
  let user = req.session.user;
  product.getProducts().then((product) => {
    res.render("user/index", { product, user, admin: false, navbar: true });
  });
});

// User login and register
router.get("/login", (req, res) => {
  if (req.session.LoggedIn) {
    res.redirect("/");
  } else {
    res.render("user/login", {
      loginErr: req.session.LoggedErr,
      navbar: false,
    });
    req.session.LoggedErr = false;
  }
});
// Login form::::::::
router.post("/login", (req, res) => {
  LogIn.LoginAuth(req.body).then((response) => {
    if (response.status) {
      req.session.LoggedIn = true;
      req.session.user = response.user;
      console.log(req.session);
      res.redirect("/");
    } else {
      req.session.LoggedErr = "Invalid Username or Password";
      res.redirect("/login");
    }
  });
});

// register::::::::
router.get("/register", (req, res) => {
  if (req.session.LoggedIn) {
    res.redirect("/");
  } else {
    res.render("user/register", {
      SignupErr: req.session.SignupErr,
      navbar: false,
    });
    req.session.SignupErr = false;
  }
});
router.post("/signup", (req, res) => {
  const { Username, Email, Password, Password2 } = req.body;
  if (!Username || !Email || !Password) {
    req.session.SignupErr = "Please fill in all fields.";
    res.redirect("/register");
  } else if (Password != Password2) {
    req.session.SignupErr = "Password does not match.";
    res.redirect("/register");
  } else {
    SignIn.SignAuth(req.body).then((response) => {
      if (response.statusFound) {
        res.redirect("/login");
      } else {
        req.session.SignupErr = "Email already exists";
        res.redirect("/register");
      }
    });
  }
});

// Admin Authentication
router.get("/admin/SignIn", (req, res) => {
  if (req.session.admin) {
    res.redirect("/admin");
  } else {
    res.render("admin/login", { loginErr: req.session.error });
    req.session.error = false;
  }
});
router.post("/admin/signIn", (req, res) => {
  LogIn.adminAuth(req.body).then((response) => {
    if (response.admin) {
      req.session.admin = true;
      res.redirect("/admin");
    } else {
      req.session.error = response.error;
      res.redirect("/admin/SignIn");
    }
  });
});

// LogOut!!!!
router.get("/logout", function (req, res) {
  req.session.destroy();
  res.redirect("/");
});
router.get("/admin/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/admin/signIn");
});

module.exports = router;

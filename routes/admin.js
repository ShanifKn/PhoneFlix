const express = require("express");
const router = express.Router();
const product = require("../Setup/product");
const User = require("../Setup/auth");

router.get("/", (req, res) => {
  if (req.session.admin) {
    req.session.adminApproved = true;
    product.getProducts().then((product) => {
      res.render("admin/Store", { product, admin: true, navbar: true });
    });
  } else {
    res.redirect("/admin/SignIn");
  }
});

// Add product!
router.get("/add-product", (req, res) => {
  if (req.session.adminApproved) {
    res.render("admin/add-product");
  } else {
    res.redirect("/admin/SignIn");
  }
});

router.post("/add-product", (req, res) => {
  product.addProduct(req.body, (id) => {
    let image = req.files.image;
    image.mv("./public/product-images/" + id + ".jpg", (err, done) => {
      if (!err) {
        res.render("admin/add-product");
      }
    });
  });
});

// Delete product!
router.get("/delete-product/:id", (req, res) => {
  if (req.session.adminApproved) {
    let productId = req.params.id;
    product.deleteProduct(productId).then((response) => {
      res.redirect("/admin");
    });
  } else {
    res.redirect("/admin/SignIn");
  }
});

// Edit product!
router.get("/edit-product/:id", async (req, res) => {
  if (req.session.adminApproved) {
    let products = await product.getProductDetails(req.params.id);
    res.render("admin/edit-product", { products });
  } else {
    res.redirect("/admin/SignIn");
  }
});

router.post("/edit-product/:id", (req, res) => {
  product.UpdateProduct(req.params.id, req.body).then(() => {
    res.redirect("/admin");
    if (req.files.image) {
      let image = req.files.image;
      image.mv("./public/product-images/" + req.params.id + ".jpg");
    }
  });
});

// User !!
router.get("/user", (req, res) => {
  User.getUser().then((userDetails) => {
    res.render("admin/user", { userDetails });
  });
});
router.get("/delete-user/:id", (req, res) => {
  let userId = req.params.id;
  User.deleteUser(userId).then(() => {
    res.redirect("/admin/user");
  });
});

// Search..
router.post("/search", (req, res) => {
  User.UserSearch(req.body).then((userDetails) => {
    res.render("admin/user", { userDetails });
  });
});

module.exports = router;

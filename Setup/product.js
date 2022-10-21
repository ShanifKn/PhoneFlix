const db = require("../config/connection");
const collections = require("../config/collections");
const objectId = require("mongodb").ObjectId;

module.exports = {
  addProduct: (product, callback) => {
    db.get()
      .collection("product")
      .insertOne(product)
      .then((data) => {
        callback(data.insertedId);
      });
  },
  getProducts: () => {
    return new Promise(async (resolve, reject) => {
      let products = await db
        .get()
        .collection(collections.PRODUCT_COLLECTION)
        .find()
        .toArray();
      resolve(products);
    });
  },
  deleteProduct: (productId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.PRODUCT_COLLECTION)
        .deleteOne({ _id: objectId(productId) })
        .then((response) => {
          resolve(response);
        });
    });
  },

  getProductDetails: (productId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.PRODUCT_COLLECTION)
        .findOne({ _id: objectId(productId) })
        .then((product) => {
          resolve(product);
        });
    });
  },
  UpdateProduct: (productId, productDetails) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.PRODUCT_COLLECTION)
        .updateOne(
          { _id: objectId(productId) },
          {
            $set: {
              name: productDetails.name,
              Category: productDetails.Category,
              Price: productDetails.Price,
              description: productDetails.description,
            },
          }
        )
        .then((response) => {
          resolve(response);
        });
    });
  },
};

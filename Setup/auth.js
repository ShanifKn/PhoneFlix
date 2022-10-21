const db = require("../config/connection");
const collections = require("../config/collections");
const bcrypt = require("bcryptjs");
const objectId = require("mongodb").ObjectId;

// Email Validation...
async function validate(Email) {
  const userFind = await db
    .get()
    .collection(collections.USER_COLLECTION)
    .findOne({ Email: Email });
  if (userFind) {
    return false;
  } else {
    return true;
  }
}

module.exports = {
  SignAuth: (UserData) => {
    let response = {};
    return new Promise(async (resolve, reject) => {
      if (await validate(UserData.Email)) {
        UserData.Password = await bcrypt.hash(UserData.Password, 10);
        UserData.Password2 = await bcrypt.hash(UserData.Password2, 10);
        db.get()
          .collection(collections.USER_COLLECTION)
          .insertOne(UserData)
          .then((response) => {
            response.statusFound = true;
            resolve(response);
          });
      } else {
        response.statusFound = false;
        resolve(response);
      }
    });
  },
  LoginAuth: (UserData) => {
    return new Promise(async (resolve, reject) => {
      let response = {};
      let user = await db
        .get()
        .collection(collections.USER_COLLECTION)
        .findOne({ Email: UserData.Email });
      if (user) {
        bcrypt.compare(UserData.Password, user.Password).then((status) => {
          if (status) {
            console.log("LOgin Success:");
            response.user = user;
            response.status = true;
            resolve(response);
          } else {
            console.log("LOgin Failure:");
            resolve({ status: false });
          }
        });
      } else {
        console.log("Login Failure:");
        resolve({ status: false });
      }
    });
  },
  getUser: () => {
    return new Promise(async (resolve, reject) => {
      let user = await db
        .get()
        .collection(collections.USER_COLLECTION)
        .find()
        .toArray();
      resolve(user);
    });
  },

  deleteUser: (userId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.USER_COLLECTION)
        .deleteOne({ _id: objectId(userId) })
        .then((response) => {
          console.log(response);
          resolve(response);
        });
    });
  },

  adminAuth: async (adminData) => {
    let response = {};
    let admin = await db
      .get()
      .collection(collections.ADMIN_DATA)
      .findOne({ Email: adminData.Email });
    if (admin) {
      if (adminData.Password == admin.Password) {
        response.admin = true;
      } else {
        response.admin = false;
        response.error = "Invalid Password";
      }
    } else {
      response.admin = false;
      response.error = "Invalid Credentials";
    }
    return response;
  },
  UserSearch: (Search) => {
    return new Promise(async (resolve, reject) => {
      let user = [];
      console.log(Search);
      user.push(
        await db
          .get()
          .collection(collections.USER_COLLECTION)
          .findOne({ Username: Search.Search })
      );
      console.log(user);
      resolve(user);
    });
  },
};

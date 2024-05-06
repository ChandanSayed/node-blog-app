const bcryptjs = require("bcryptjs");

const usersCollection = require("../db").db().collection("users");
const validator = require("validator");
const md5 = require("md5");

let User = function (data) {
  this.data = data;
  this.errors = [];
};

User.prototype.cleanUp = function () {
  if (typeof this.data.username !== "string") {
    this.data.username = "";
  }
  if (typeof this.data.email !== "string") {
    this.data.email = "";
  }
  if (typeof this.data.password !== "string") {
    this.data.password = "";
  }
  this.data = {
    username: this.data.username.trim().toLowerCase(),
    email: this.data.email.trim().toLowerCase(),
    password: this.data.password
  };
};

User.prototype.validate = function () {
  return new Promise(async (resolve, reject) => {
    if (this.data.username === "") {
      this.errors.push("You Must provide a username");
    }
    if (this.data.username != "" && !validator.isAlphanumeric(this.data.username)) {
      this.errors.push("Username can only contains letters and numbers");
    }
    if (this.data.username != "" && this.data.username.length < 3) {
      this.errors.push("Password must be at least 3 characters");
    }
    if (this.data.username != "" && this.data.username.length > 32) {
      this.errors.push("Password must be at less than 32 characters");
    }
    if (!validator.isEmail(this.data.email)) {
      this.errors.push("You must provide a valid email");
    }
    if (this.data.password === "") {
      this.errors.push("You must provide a password");
    }
    if (this.data.password != "" && this.data.password.length < 12) {
      this.errors.push("Password Must be at lease 12 characters!");
    }

    //Only if username is valid then check to see if it's already taken

    if (
      this.data.username.length > 2 &&
      this.data.username.length < 31 &&
      validator.isAlphanumeric(this.data.username)
    ) {
      const usernameExists = await usersCollection.findOne({
        username: this.data.username
      });
      if (usernameExists) {
        this.errors.push("Username is already taken");
      }
    }
    //Only if Email is valid then check to see if it's already taken
    if (validator.isEmail(this.data.email)) {
      const emailExists = await usersCollection.findOne({
        email: this.data.email
      });
      if (emailExists) {
        this.errors.push("Email is already taken");
      }
    }
    resolve();
  });
};

User.prototype.register = function () {
  return new Promise(async (resolve, reject) => {
    this.cleanUp();
    await this.validate();
    if (!this.errors.length) {
      // hash the password

      const salt = bcryptjs.genSaltSync(10);

      this.data.password = bcryptjs.hashSync(this.data.password, salt);

      await usersCollection.insertOne(this.data);
      this.getAvatar();
      resolve();
    } else {
      reject(this.errors);
    }
  });
};

User.prototype.login = function () {
  return new Promise(async (resolve, reject) => {
    try {
      this.cleanUp();
      const existingUser = await usersCollection.findOne({
        username: this.data.username
      });

      if (existingUser && bcryptjs.compareSync(this.data.password, existingUser.password)) {
        this.getAvatar();
        resolve("Congrats!");
      } else {
        reject("Invalid user/password");
      }
    } catch (err) {
      reject("Try with correct credentials");
    }
  });
};

User.prototype.getAvatar = function () {
  this.avatar = `https://gravatar.com/avatar/${md5(this.data.email)}?s=128`;
};

module.exports = User;

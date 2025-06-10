const mongoose = require("mongoose");
const generate = require("../helpers/generate");

const accountSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    token: {
      type: String,
      default: generate.generateRandomString(20),
    },
    phone: {
      type: String,
    },
    avatar: {
      type: String,
    },
    role_id: String,
    status: String,
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  { timestamps: true }
);

const Account = mongoose.model("Account", accountSchema, "accounts");

module.exports = Account;

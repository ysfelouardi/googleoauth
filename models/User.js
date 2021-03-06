const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  fullname: String,
  username: String,
  googleId: String,
  password: String
});

mongoose.model("users", userSchema);

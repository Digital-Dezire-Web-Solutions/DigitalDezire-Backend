const mongoose = require("mongoose");
const { Schema } = mongoose;

// Admin Schema
const AdminSchema = new Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "admin" },
  date: { type: Date, default: Date.now },
});

// Register Models
const Admin = mongoose.model("Admin", AdminSchema);

module.exports = { Admin };

const mongoose = require("mongoose");
const { Schema } = mongoose;

const BlogSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  description: String,
  keyword: String,
  imageAlt: String,
  content: { type: String, required: true }, // store HTML content directly
  image: { type: String }, // main banner image
  thumbnail1: { type: String },
  thumbnail2: { type: String },
  thumbnail3: { type: String },
  category: { type: String },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "admin" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

module.exports = mongoose.model("Blog", BlogSchema);
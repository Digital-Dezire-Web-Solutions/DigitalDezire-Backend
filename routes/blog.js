const express = require("express");
const router = express.Router();
const Blog = require("../models/Blog");
const fetchAdmin = require("../middleware/fetchAdmin");
const { upload } = require("../middleware/cloudinary");

// ✅ Create Blog
router.post(
  "/add",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "thumbnail1", maxCount: 1 },
    { name: "thumbnail2", maxCount: 1 },
    { name: "thumbnail3", maxCount: 1 },
  ]),
  fetchAdmin,
  async (req, res) => {
    try {
      const { title, description, keyword, imageAlt, content, category } =
        req.body;
      const imagePaths = {};
      ["image", "thumbnail1", "thumbnail2", "thumbnail3"].forEach((key) => {
        if (req.files && req.files[key]) {
          imagePaths[key] = req.files[key][0].path;
        }
      });

      const blog = new Blog({
        title,
        description,
        keyword,
        imageAlt,
        content,
        category,
        author: req.admin._id,
        ...imagePaths,
      });

      const savedBlog = await blog.save();
      res.json({ success: true, message: "ok", blog: savedBlog });
    } catch (error) {
      console.error("Error creating blog:", error.message);
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

// ✅ Edit Blog
router.put(
  "/edit/:id",
  fetchAdmin,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "thumbnail1", maxCount: 1 },
    { name: "thumbnail2", maxCount: 1 },
    { name: "thumbnail3", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title, description, keyword, imageAlt, content, category } =
        req.body;
      const blog = await Blog.findById(req.params.id);
      if (!blog) return res.status(404).send("Blog not found");

      const updateData = {
        title,
        description,
        keyword,
        imageAlt,
        content,
        category,
        updatedAt: Date.now(),
      };

      ["image", "thumbnail1", "thumbnail2", "thumbnail3"].forEach((key) => {
        if (req.files[key]) {
          updateData[key] = req.files[key][0].path; // Cloudinary URL
        }
      });

      const updatedBlog = await Blog.findByIdAndUpdate(
        req.params.id,
        { $set: updateData },
        { new: true }
      );

      res.json(updatedBlog);
    } catch (error) {
      console.error("Error editing blog:", error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ✅ Delete Blog
router.delete("/delete/:id", fetchAdmin, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).send("Blog not found");
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ success: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ✅ Get All Blogs
router.get("/all", async (req, res) => {
  try {
    const blogs = await Blog.find().populate("author", "userName email");
    res.json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;

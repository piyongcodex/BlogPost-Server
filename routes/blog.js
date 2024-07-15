const express = require("express");
const blogController = require("../controllers/blog");
const { verify } = require("../auth");

const router = express.Router();

router.post("/addBlog", verify, blogController.addBlog);

router.get("/getBlogs", verify, blogController.getBlogs);
router.get("/getBlog/:id", verify, blogController.getBlog);

router.patch("/addComment/:id", verify, blogController.addComment);
router.patch("/updateComment/:id", verify, blogController.updateComment);
router.patch("/updateBlog/:id", verify, blogController.updateBlog);
router.patch("/removeComment/:id", verify, blogController.removeComment);

router.delete("/deleteBlog/:id", verify, blogController.deleteBlog);

module.exports = router;

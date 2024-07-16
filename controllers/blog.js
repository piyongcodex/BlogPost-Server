const Blog = require("../models/Blog");

module.exports.addBlog = async (req, res) => {
  const { title, content, author } = req.body;
  console.log(title);
  // Validate input
  if (!title || !content) {
    return res.status(400).send({ error: "Title and content are required" });
  }

  try {
    // Create a new blog instance
    const newBlog = new Blog({
      title,
      content,
      userId: req.user.id,
      author,
    });
    // Save the blog to the database
    const savedBlog = await newBlog.save();
    return res.status(201).send(savedBlog);
  } catch (error) {
    console.error("Error in saving the blog: ", error);
    return res
      .status(500)
      .send({ error: "Failed to save the blog", details: error.message });
  }
};
module.exports.getMyBlogs = (req, res) => {
  const userId = req.user.id;

  Blog.find({ userId: userId })
    .then((blogs) => {
      if (blogs.length > 0) {
        return res.status(200).send({ blogs });
      } else {
        return res.status(404).send({ message: "No blogs found." });
      }
    })
    .catch((err) => {
      console.error("Error finding blogs:", err);
      return res.status(500).send({ error: "Error finding blogs." });
    });
};
module.exports.getBlogs = (req, res) => {
  Blog.find()
    .then((blogs) => {
      if (blogs.length > 0) {
        return res.status(200).send({ blogs });
      } else {
        return res.status(200).send({ message: "No items found." });
      }
    })
    .catch((err) => res.status(500).send({ error: "Error finding items." }));
};
module.exports.getBlog = (req, res) => {
  const { id } = req.params;
  Blog.findOne({ _id: id })
    .then((blog) => {
      if (blog) {
        return res.status(200).send({ blog });
      } else {
        return res.status(404).send({ message: "Blog not found." });
      }
    })
    .catch((err) =>
      res
        .status(500)
        .send({ error: "Error finding blog.", details: err.message })
    );
};
module.exports.addComment = (req, res) => {
  return Blog.findById(req.params.id)
    .then((blog) => {
      if (!blog) {
        return res.status(404).send({ error: "Blog not found" });
      }

      const { comment } = req.body;
      const userId = req.user.id;

      blog.comments.push({ userId, comment });

      return blog.save().then((updatedBlog) => {
        return res.status(200).send({
          message: "Comment added successfully",
          updatedBlog,
        });
      });
    })
    .catch((findErr) => {
      console.error("Error finding movie: ", findErr);
      return res.status(500).send({ error: "Failed to fetch movie" });
    });
};
module.exports.updateComment = (req, res) => {
  return Blog.findOne({ "comments._id": req.params.id })
    .then((blog) => {
      if (!blog) {
        return res.status(404).send({ error: "Comment not found" });
      }
      // Find the comment and update it
      const updateComment = blog.comments.id(req.params.id);
      updateComment.comment = req.body.comment; // Assuming the new comment text is in req.body.text

      return blog
        .save()
        .then(() =>
          res.status(200).send({ message: "Comment updated successfully" })
        )
        .catch((saveErr) => {
          console.error("Error saving blog comment: ", saveErr);
          return res.status(500).send({ error: "Failed to save blog comment" });
        });
    })
    .catch((findErr) => {
      console.error("Error finding blog comment: ", findErr);
      return res.status(500).send({ error: "Failed to fetch blog comment" });
    });
};
module.exports.updateBlog = (req, res) => {
  let blogUpdates = {
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
  };

  return Blog.findByIdAndUpdate(req.params.id, blogUpdates)
    .then((updatedBlog) => {
      if (!updatedBlog) {
        return res.status(404).send({ error: "Blog not found" });
      }

      return res.status(200).send({
        message: "Blogpost updated successfully",
        updatedBlog: updatedBlog,
      });
    })
    .catch((err) => {
      console.error("Error in updating a Blog : ", err);
      return res.status(500).send({ error: "Error in updating a Blog.", err });
    });
};
module.exports.removeComment = (req, res) => {
  return Blog.findOne({ "comments._id": req.params.id })
    .then((blog) => {
      if (!blog) {
        return res.status(404).send({ error: "Comment not found" });
      }

      // Find the index of the comment to be removed
      const commentIndex = blog.comments.findIndex(
        (comment) => comment._id.toString() === req.params.id
      );

      if (commentIndex === -1) {
        return res.status(404).send({ error: "Comment not found" });
      }

      // Remove the comment from the comments array
      blog.comments.splice(commentIndex, 1);

      return blog
        .save()
        .then(() =>
          res.status(200).send({ message: "Comment removed successfully" })
        )
        .catch((saveErr) => {
          console.error("Error saving blog: ", saveErr);
          return res.status(500).send({ error: "Failed to save blog" });
        });
    })
    .catch((findErr) => {
      console.error("Error finding blog: ", findErr);
      return res.status(500).send({ error: "Failed to fetch blog" });
    });
};
module.exports.deleteBlog = (req, res) => {
  return Blog.deleteOne({ _id: req.params.id })
    .then((deletedResult) => {
      if (deletedResult < 1) {
        return res.status(400).send({ error: "No Item deleted" });
      }

      return res.status(200).send({
        message: "Blog deleted successfully",
      });
    })
    .catch((err) => {
      console.error("Error in deleting a Movie : ", err);
      return res.status(500).send({ error: "Error in deleting a Movie." });
    });
};

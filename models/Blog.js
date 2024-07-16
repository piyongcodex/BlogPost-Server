const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  content: {
    type: String,
    required: [true, "Content is required"],
  },
  userId: {
    type: String,
    required: [true, "User ID is required"],
  },
  author: {
    type: String,
    required: [true, "User ID is required"],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
  comments: {
    type: [
      {
        userId: {
          type: String,
          required: [true, "User ID is required"],
        },
        comment: {
          type: String,
          required: [true, "Comment is required"],
        },
      },
    ],
    default: [],
  },
});

module.exports = mongoose.model("Blogs", blogSchema);

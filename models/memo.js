const mongoose = require("mongoose");
const path = require("path");
const uploadsPath = "uploads/files";

const memoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  expense: {
    type: Number,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  fileUpload: {
    type: String,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Author",
  },
});

memoSchema.virtual("coverImagePath").get(function () {
  if (this.coverImageName != null) {
    return path.join("/", uploadsPath, this.coverImageName);
  }
});

module.exports = mongoose.model("Memo", memoSchema);

module.exports.uploadsPath = uploadsPath;

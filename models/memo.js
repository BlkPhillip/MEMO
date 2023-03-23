const mongoose = require("mongoose");

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
  filesUpload: {
    type: Buffer,
  },
  filesUploadType: {
    type: String,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Author",
  },
});

memoSchema.virtual("filesUploadPath").get(function () {
  if (this.filesUpload != null && this.filesUploadType != null) {
    return `data:${
      this.filesUploadType
    };charset=utf-8;base64,${this.filesUpload.toString("base64")}`;
  }
});

module.exports = mongoose.model("Memo", memoSchema);

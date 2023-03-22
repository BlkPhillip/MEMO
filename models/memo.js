const mongoose = require("mongoose");
// const path = require('path')
const uploadFiles = "uploads/files";

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
    type: String,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Author",
  },
});

// memoSchema.virtual('filesUploadPath').get(function() {
//   if (this.filesUpload != null) {
//     return path.join('/', uploadFiles, this.filesUpload)
//   }
// })

module.exports = mongoose.model("Memo", memoSchema);
module.exports.uploadFiles = uploadFiles;

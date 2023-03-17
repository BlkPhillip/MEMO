const mongoose = require("mongoose");

const memoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Memo", memoSchema);

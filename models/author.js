const mongoose = require("mongoose");
const Memo = require("./memo");

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

authorSchema.pre("deleteOne", async function (next) {
  try {
    const query = this.getFilter();
    const hasBook = await Memo.exists({ author: query._id });

    if (hasBook) {
      next(new Error("This author still has books."));
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Author", authorSchema);

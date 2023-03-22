const express = require("express");
const router = express.Router();
const Memo = require("../models/memo");

router.get("/", async (req, res) => {
  let memos;
  try {
    memos = await Memo.find().sort({ createdAt: "desc" }).limit(10).exec();
  } catch {
    memos = [];
  }
  res.render("index", { memos: memos });
});

module.exports = router;

const express = require("express");
const { authMiddleware } = require("../middleware");
const { Account } = require("../db");
const router = express.Router();

router.get("/balance", authMiddleware, async (req, res) => {
  const userAccount = await Account.findOne({ userId: req.userId });

  if (!userAccount && !userAccount._id) {
    return res.status(400).json({
      success: false,
      message: "No account found for the user.",
    });
  }

  return res.status(200).json({
    success: true,
    balance: userAccount.balance,
  });
});

module.exports = router;

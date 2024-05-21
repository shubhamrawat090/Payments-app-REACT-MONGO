const express = require("express");
const { authMiddleware } = require("../middleware");
const { Account, User } = require("../db");
const mongoose = require("mongoose");
const router = express.Router();
const z = require("zod");

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

const transferBody = z.object({
  to: z.string({
    required_error: "'to' is required",
    invalid_type_error: "'to' should be a string",
  }),
  amount: z
    .number({
      required_error: "'amount' is required",
      invalid_type_error: "'amount' should be a number",
    })
    .positive({ message: "Transfer amount should be GREATER THAN 0" }),
});

router.post("/transfer", authMiddleware, async (req, res) => {
  // perform a DB transaction(means either all search user, add & deduct requests pass or none of them pass)
  const session = await mongoose.startSession();

  session.startTransaction();
  const { success, error } = transferBody.safeParse(req.body);
  // Invalid ZOD schema validation
  if (!success) {
    await session.abortTransaction();
    return res.status(400).json({
      success: false,
      message: error.errors[0].message,
    });
  }

  // Fetch the inputs from request body
  const { to, amount } = req.body;

  // Just checks that 'to' is in the format '663f5c9b99ec2109a6d8af9d' instead of a random string 'hello'
  if (!mongoose.isValidObjectId(to)) {
    await session.abortTransaction();
    return res.status(400).json({
      success: false,
      message: "'to' is NOT a valid ObjectId.",
    });
  }

  // Check if to is NOT same the the loggedIn account. Means you are sending money to yourself only
  if (to === req.userId) {
    await session.abortTransaction();
    return res.status(400).json({
      success: false,
      message: "You can NOT send money to YOUR OWN account.",
    });
  }

  // Fetch loggedIn account
  const loggedInAccount = await Account.findOne({ userId: req.userId }).session(
    session
  );

  if (!loggedInAccount) {
    await session.abortTransaction();
    return res.status(400).json({
      success: false,
      message: "Logged in account NOT found. Please login and try again.",
    });
  }

  if (loggedInAccount.balance < amount) {
    await session.abortTransaction();
    return res.status(400).json({
      success: false,
      message: "Insufficient balance.",
    });
  }

  // Fetch the toAccount - account you want to send the money toi
  const toAccount = await Account.findOne({ userId: to }).session(session);
  if (!loggedInAccount) {
    await session.abortTransaction();
    return res.status(400).json({
      success: false,
      message: "Invalid account. Cannot send money to this account.",
    });
  }

  // loggedInAccount ==> balance - amount
  await Account.updateOne({ userId: req.userId }, { $inc: -amount }).session(
    session
  );
  // toAccount ==> balance + amount
  await Account.updateOne({ userId: to }, { $inc: amount }).session(session);

  // Commit the transaction
  await session.commitTransaction();

  res.status(200).json({
    success: true,
    message: "Transaction successful.",
  });
});

module.exports = router;

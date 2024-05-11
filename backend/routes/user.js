const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

const z = require("zod");
const { User, Account } = require("../db");
const { authMiddleware } = require("../middleware");

// Zod schema for input validation
const signupBody = z.object({
  username: z
    .string({
      required_error: "Username is required",
      invalid_type_error: "Username should be a string",
    })
    .email({ message: "Invalid Username/Email Format" })
    .min(3, { message: "Username should be atleast 3 character long" })
    .max(30, { message: "Username should NOT exceed 30 characters" }),
  firstName: z
    .string({
      required_error: "First Name is required",
      invalid_type_error: "First Name should be a string",
    })
    .max(50, { message: "First Name should NOT exceed 50 characters" }),
  lastName: z
    .string({
      required_error: "Last Name is required",
      invalid_type_error: "Last Name should be a string",
    })
    .max(50, { message: "Last Name should NOT exceed 50 characters" }),
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password should be a string",
    })
    .min(6, { message: "Password should be atleast 6 characters long" }),
});

router.post("/signup", async (req, res) => {
  // Inputs validation via zod
  const { success, error } = signupBody.safeParse(req.body);

  if (!success) {
    return res
      .status(400)
      .json({ success: false, message: error.errors[0].message });
  }

  const { username, firstName, lastName, password } = req.body;

  // Check if DB already contains the user
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(411).json({
      success: false,
      message: "Email already taken/Incorrect inputs",
    });
  }

  // Create the user entry
  const newUser = await User.create({
    username,
    firstName,
    lastName,
    password,
  });

  const newUserId = newUser._id;

  // Generate token via JWT
  const token = jwt.sign({ userId: newUserId }, JWT_SECRET);

  ///// CREATE A NEW ACCOUNT AND GIVE BALANCE BETWEEN 1-10000
  await Account.create({
    userId: newUserId,
    balance: (1 + Math.random() * 10000).toFixed(2), // Currency shouldn't have more than 2 decimal places
  });

  return res.status(200).json({
    success: true,
    message: "User created successfully",
    token: token,
  });
});

// Zod schema for input validation
const signinBody = z.object({
  username: z
    .string({
      required_error: "Username is required",
      invalid_type_error: "Username should be a string",
    })
    .email({ message: "Invalid Username/Email Format" })
    .min(3, { message: "Username should be atleast 3 character long" })
    .max(30, { message: "Username should NOT exceed 30 characters" }),
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password should be a string",
    })
    .min(6, { message: "Password should be atleast 6 characters long" }),
});

router.post("/signin", async (req, res) => {
  // Inputs validation via zod
  const { success, error } = signinBody.safeParse(req.body);

  if (!success) {
    return res
      .status(400)
      .json({ success: false, message: error.errors[0].message });
  }

  const { username, password } = req.body;

  // Check if DB already contains the user
  const existingUser = await User.findOne({ username, password });
  if (existingUser) {
    // Validate the token
    const token = jwt.sign(
      {
        userId: existingUser._id,
      },
      JWT_SECRET
    );

    return res.status(200).json({
      success: true,
      token: token,
    });
  } else {
    res.status(411).json({
      success: false,
      message: "Error while logging in",
    });
  }
});

// Update the user credentials
const updateBody = z.object({
  password: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

router.put("/", authMiddleware, async (req, res) => {
  const { success } = updateBody.safeParse(req.body);
  if (!success) {
    res.status(411).json({
      success: false,
      message: "Error while updating information",
    });
  }

  await User.updateOne({ _id: req.userId }, req.body);

  res.status(200).json({
    success: true,
    message: "Updated successfully",
  });
});

// Search users either by firstName or lastName
router.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";

  // Works same as SELECT * FROM users WHERE firstName LIKE "%shubh%" OR lastName LIKE "%shubh%"
  const users = await User.find({
    $or: [
      {
        firstName: {
          $regex: filter,
        },
      },
      {
        lastName: {
          $regex: filter,
        },
      },
    ],
  });

  res.status(200).json({
    success: true,
    user: users.map((user) => ({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id,
    })),
  });
});

module.exports = router;

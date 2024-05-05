const { JWT_SECRET } = require("./config");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Extract token from headers stored in the format "Bearer {TOKEN}"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({});
  }

  const token = authHeader.split(" ")[1];

  try {
    // Decode the token(encoded form) to get the userId which we stored when we signup/signin
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.userId) {
      req.userId = decoded.userId;
      next();
    } else {
      return res.status(403).json({ success: false });
    }
  } catch (err) {
    return res.status(403).json({ success: false });
  }
};

module.exports = {
  authMiddleware,
};

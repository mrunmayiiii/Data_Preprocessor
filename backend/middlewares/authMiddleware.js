const jwt = require("jsonwebtoken");

const ensureAuthenticated = (req, res, next) => {
  const auth = req.headers["authorization"];
  if (!auth) {
    return res.status(403).json({ message: "unauthorised user - token missing" });
  }

  try {
    const decoded = jwt.verify(auth, process.env.JWT_SECRET);

    // 🧠 Normalize user data (handle tokens with "id" or "email")
    req.user = {
      _id: decoded._id || decoded.id || null,
      email: decoded.email || null,
      name: decoded.name || null
    };

    if (!req.user._id) {
      return res.status(400).json({ message: "Invalid token: no user id found" });
    }

    next();
  } catch (error) {
    console.error("JWT error:", error.message);
    return res.status(403).json({ message: "unauthorised user" });
  }
};

module.exports = { ensureAuthenticated };

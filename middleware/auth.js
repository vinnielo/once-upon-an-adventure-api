const jwt = require("jsonwebtoken");

function tokenSecret() {
  const secret = process.env.JWT_SECRET;
  if (typeof secret !== "string" || !secret.trim()) {
    throw new Error("JWT_SECRET must be configured");
  }
  return secret;
}

function createToken(user) {
  return jwt.sign({ sub: String(user._id), email: user.email }, tokenSecret(), { expiresIn: "8h" });
}

function requireAuth(req, res, next) {
  const authorization = req.headers.authorization || "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Authentication required" } });
  }

  try {
    req.auth = jwt.verify(token, tokenSecret());
    return next();
  } catch (error) {
    if (error.message === "JWT_SECRET must be configured") {
      return res.status(500).json({ error: { code: "AUTH_CONFIGURATION_ERROR", message: "Authentication is not configured" } });
    }
    return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Invalid or expired token" } });
  }
}

function requireUserAuth(req, res, next) {
  if (!req.params.id || req.auth.sub === String(req.params.id)) {
    return next();
  }
  return res.status(403).json({ error: { code: "FORBIDDEN", message: "You cannot access another user's state" } });
}

module.exports = { createToken, requireAuth, requireUserAuth };

import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { STATUS_CODES, USER_ROLE } from "../lib/constants.js";
import { errResponseBody } from "../lib/responseBody.js";

/**
 * protect middleware — supports both:
 *  1. JWT Bearer token via Authorization header
 *  2. express-session (fallback when no Authorization header)
 */

export const protectRoute = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // --- Token-based auth ---
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select("-password -refreshToken");
      if (!user) {
        return res.status(STATUS_CODES.unauthorized).json(errResponseBody("User no longer exists"));
      }
      req.user = user;
      return next();
    }

    // --- Session-based auth ---
    if (req.session && req.session.userId) {
      const user = await User.findById(req.session.userId).select("-password -refreshToken");
      if (!user) {
        return res.status(STATUS_CODES.unauthorized).json(errResponseBody("User no longer exists"));
      }
      req.user = user;
      return next();
    }

    return res
      .status(STATUS_CODES.unauthorized)
      .json(errResponseBody("Not authenticated. Please log in."));
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res
        .status(STATUS_CODES.unauthorized)
        .json(errResponseBody("Invalid or expired token. Please log in again."));
    }
    return res
      .status(STATUS_CODES.internal_server_error)
      .json(errResponseBody("Authentication error"));
  }
};


/**
 * requireRole(...roles) — Authorization middleware.
 * Checks whether the authenticated user has one of the allowed roles.
 * MUST always run after protectRoute (needs req.user to be set).
 *
 * Usage:
 *   router.post("/records", protectRoute, requireRole("admin"), createRecord);
 *   router.get("/insights", protectRoute, requireRole("admin", "analyst"), getInsights);
 *   router.delete("/users/:id", protectRoute, requireAdmin, deleteUser);
 */
export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    // Safeguard: requireRole without protectRoute
    return res
      .status(STATUS_CODES.unauthorized)
      .json(errResponseBody("Not authenticated. Please log in."));
  }

  if (!roles.includes(req.user.role)) {
    return res
      .status(STATUS_CODES.forbidden)
      .json(
        errResponseBody(
          `Access denied. Required role: ${roles.join(" or ")}. Your role: ${req.user.role}`
        )
      );
  }

  next();
};

// Convenience shorthand — use this for admin-only routes
export const requireAdmin = requireRole(USER_ROLE.ADMIN);

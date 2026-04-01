import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { STATUS_CODES } from "../lib/constants.js";
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

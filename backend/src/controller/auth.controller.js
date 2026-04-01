import { createUser, loginUser, generateTokens } from "../services/auth.services.js";
import { STATUS_CODES } from "../lib/constants.js";
import { errResponseBody, successResponseBody } from "../lib/responseBody.js";
import User from "../models/user.model.js";

export const signup = async (req, res) => {
  try {
    const userData = req.body;
    const user = await createUser(userData);

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    // Persist refresh token in DB
    await User.findByIdAndUpdate(user._id, { refreshToken });

    // Set session
    req.session.userId = user._id.toString();

    // Return user without sensitive fields
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.refreshToken;

    return res.status(STATUS_CODES.created).json(
      successResponseBody("User created successfully", { accessToken, refreshToken, user: userObj })
    );
  } catch (error) {
    console.error(error);
    if (error.err) {
      return res
        .status(error.code || STATUS_CODES.internal_server_error)
        .json(errResponseBody("Request failed", error.err));
    }
    return res
      .status(STATUS_CODES.internal_server_error)
      .json(errResponseBody());
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(STATUS_CODES.bad_request)
        .json(errResponseBody("Email and password are required"));
    }

    const user = await loginUser(email, password);

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    // Persist refresh token in DB
    await User.findByIdAndUpdate(user._id, { refreshToken });

    // Set session
    req.session.userId = user._id.toString();

    // Return user without sensitive fields
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.refreshToken;

    return res.status(STATUS_CODES.ok).json(
      successResponseBody("User logged in successfully", { accessToken, refreshToken, user: userObj })
    );
  } catch (error) {
    console.error(error);
    if (error.err) {
      return res
        .status(error.code || STATUS_CODES.internal_server_error)
        .json(errResponseBody("Login failed", error.err));
    }
    return res
      .status(STATUS_CODES.internal_server_error)
      .json(errResponseBody());
  }
};

export const logout = async (req, res) => {
  try {
    // Clear refresh token from DB if user is authenticated
    if (req.session?.userId) {
      await User.findByIdAndUpdate(req.session.userId, { refreshToken: null });
    }

    // Destroy session
    req.session.destroy((err) => {
      if (err) {
        return res
          .status(STATUS_CODES.internal_server_error)
          .json(errResponseBody("Logout failed"));
      }
      res.clearCookie("connect.sid");
      return res.status(STATUS_CODES.ok).json(successResponseBody("Logged out successfully"));
    });
  } catch (error) {
    console.error(error);
    return res
      .status(STATUS_CODES.internal_server_error)
      .json(errResponseBody());
  }
};

export const getMe = async (req, res) => {
  // req.user is populated by the protect middleware
  return res.status(STATUS_CODES.ok).json(successResponseBody("User profile fetched", req.user));
};
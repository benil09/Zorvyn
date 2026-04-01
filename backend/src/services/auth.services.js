import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { STATUS_CODES } from "../lib/constants.js";

export const createUser = async (userData) => {
  try {
    if (!userData.email || !userData.password || !userData.name || !userData.dateOfBirth) {
      throw { err: "All fields are required", code: STATUS_CODES.bad_request };
    }
    const existingUser = await findUserByEmail(userData.email);
    if (existingUser) {
      throw { err: "User with this email already exists", code: STATUS_CODES.conflict };
    }
    const user = await User.create(userData);
    return user;
  } catch (error) {
    if (error.name === "ValidationError") {
      const err = {};
      Object.keys(error.errors).forEach((key) => {
        err[key] = error.errors[key].message;
      });
      throw { err, code: STATUS_CODES.unprocessable_entity };
    }
    throw error;
  }
};

export const loginUser = async (email, password) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw { err: "Invalid credentials", code: STATUS_CODES.unauthorized };
  }
  const isValidPassword = await user.isValidPassword(password);
  if (!isValidPassword) {
    throw { err: "Invalid credentials", code: STATUS_CODES.unauthorized };
  }
  return user;
};

export const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m" }
  );
  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d" }
  );
  return { accessToken, refreshToken };
};
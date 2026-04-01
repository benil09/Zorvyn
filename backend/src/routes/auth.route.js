import express from 'express';
import { signup, login, logout, getMe } from '../controller/auth.controller.js';
import { protectRoute, requireAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post("/auth/signup", signup);
router.post("/auth/login", login);
router.post("/auth/logout", protectRoute, logout);
router.get("/auth/me", protectRoute, getMe);

export default router;
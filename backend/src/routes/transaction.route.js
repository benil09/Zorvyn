import express from 'express'
import {protectRoute,requireAdmin,requireRole} from "../middlewares/auth.middleware.js"
import { createTransaction ,getAllTransactions,getTransactionById,updateTransaction,deleteTransaction,getSummary,getRecent,getCategoryStats,getTrends } from '../controller/transaction.controller.js';


const router = express.Router();

// -------------------- CRUD ----------------------------
router.post("/transactions", protectRoute , requireAdmin, createTransaction);
router.get("/transactions", protectRoute, getAllTransactions);
router.get("/transactions/:id", protectRoute, getTransactionById);
router.patch("/transactions/:id", protectRoute, requireAdmin, updateTransaction);
router.delete("/transactions/:id", protectRoute, requireAdmin, deleteTransaction);

// -------------------- DASHBOARD : All Roles----------------------------
router.get("/dashboard/summary", protectRoute, getSummary);
router.get("/dashboard/recent", protectRoute, getRecent);

// Analyst + Admin: category breakdown and trends
router.get("/dashboard/by-category", protectRoute, requireRole("admin", "analyst"), getCategoryStats);
router.get("/dashboard/trends", protectRoute, requireRole("admin", "analyst"), getTrends);
export default router;

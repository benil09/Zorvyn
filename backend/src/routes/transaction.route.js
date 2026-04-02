import express from 'express'
import {protectRoute,requireAdmin} from "../middlewares/auth.middleware.js"
import { createTransaction ,getAllTransactions,getTransactionById,updateTransaction,deleteTransaction,getSummary } from '../controller/transaction.controller.js';


const router = express.Router();

// -------------------- CRUD ----------------------------
router.post("/transactions", protectRoute , requireAdmin, createTransaction);
router.get("/transactions", protectRoute, getAllTransactions);
router.get("/transactions/:id", protectRoute, getTransactionById);
router.patch("/transactions/:id", protectRoute, requireAdmin, updateTransaction);
router.delete("/transactions/:id", protectRoute, requireAdmin, deleteTransaction);

// -------------------- DASHBOARD ----------------------------
router.get("/dashboard/summary", protectRoute, getSummary);


export default router;

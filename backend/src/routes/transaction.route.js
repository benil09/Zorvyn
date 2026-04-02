import express from 'express'
import {protectRoute,requireAdmin} from "../middlewares/auth.middleware.js"
import { createTransaction ,getAllTransactions,getTransactionById } from '../controller/transaction.controller.js';


const router = express.Router();

// -------------------- CRUD ----------------------------
router.post("/transactions", protectRoute , requireAdmin, createTransaction);
router.get("/transactions", protectRoute, getAllTransactions);
router.get("/transactions/:id", protectRoute, getTransactionById);



export default router;

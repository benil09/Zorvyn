import express from 'express'
import {protectRoute,requireAdmin} from "../middlewares/auth.middleware.js"
import { createTransaction ,getTransactions } from '../controller/transaction.controller.js';

const router = express.Router();

// -------------------- CRUD : Admin Only ----------------------------
router.post("/transactions", protectRoute , requireAdmin, createTransaction);
router.get("/transactions", protectRoute, getTransactions);


export default router;

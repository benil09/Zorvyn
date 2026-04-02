import express from 'express'
import {protectRoute,requireAdmin} from "../middlewares/auth.middleware.js"
import { createTransaction } from '../controller/transaction.controller.js';

const router = express.Router();

router.post("/transactions", protectRoute , requireAdmin, createTransaction);


export default router;

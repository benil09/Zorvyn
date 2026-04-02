import mongoose from "mongoose";
import Transaction from "../models/transaction.model.js";
import { STATUS_CODES } from "../lib/constants.js";

// --------------------- CREATE TRANSACTION --------------------
export const createTransactionService = async (trxnData , userId)=>{
   const { amount, type, category, notes, currency, date } = trxnData;
   if (!amount || !type || !category) {
    throw { err: "Amount, type, and category are required", code: STATUS_CODES.bad_request };
  }
  try {
     const transaction = await Transaction.create({
      amount,
      type,
      category,
      notes,
      currency,
      date,
      userId,
    })
    return transaction.populate("userId",{name:1});
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
}
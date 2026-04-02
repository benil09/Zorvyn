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


// --------------------- GET ALL TRANSACTIONS --------------------

export const getAllTransactionsService = async (userId, query)=>{
  const {
    type,
    category,
    currency,
    startDate,
    endDate,
    page = 1,
    limit = 10,
    sortBy = "date",
    order = "desc",
  } = query;
  
  const filter = { userId }
  
  if (type) filter.type = type;
  if (category) filter.category = category;
  if (currency) filter.currency = currency;
  
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }
  
  const sortOrder = order === "asc" ? 1 : -1;
  const skip = (Number(page) - 1) * Number(limit);
  
  const [transactions, total] = await Promise.all([
    Transaction.find(filter)
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(Number(limit)),
    Transaction.countDocuments(filter),
  ]);
  
  return {
    transactions,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
  
}


// --------------------- GET  TRANSACTION BY ID --------------------

export const getTransactionByIdService = async (transactionId, userId) => {
  const transaction = await Transaction.findOne({ _id: transactionId, userId });
  if (!transaction) {
    throw { err: "Transaction not found", code: STATUS_CODES.not_found };
  }
  return transaction;
};

// --------------------- UPDATE TRANSACTION --------------------
export const updateTransactionService = async (transactionId, userId, updates) => {
  // Disallow updating sensitive/system fields
  const BLOCKED_FIELDS = ["userId", "isDeleted", "deletedBy", "createdAt", "updatedAt"];
  BLOCKED_FIELDS.forEach((field) => delete updates[field]);

  const transaction = await Transaction.findOneAndUpdate(
    { _id: transactionId, userId },
    { $set: updates },
    { returnDocument:'after', runValidators: true }
  );

  if (!transaction) {
    throw { err: "Transaction not found", code: STATUS_CODES.not_found };
  }
  return transaction.populate("userId",{name:1});
};


// -------------------- SOFT DELETE -------------------------

export const deleteTransactionService = async (transactionId, userId, deletedByUserId) => {
  const transaction = await Transaction.findOne({ _id: transactionId, userId });
  if (!transaction) {
    throw { err: "Transaction not found", code: STATUS_CODES.not_found };
  }
  await transaction.softDelete(deletedByUserId);
  return transaction;
};


// -------------------- DASHBOARD: SUMMARY -------------------------

export const getDashboardSummaryService = async (userId) => {
  const result = await Transaction.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId), isDeleted: false } },
    {
      $group: {
        _id: "$type",
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
  ]);

  const summary = { totalIncome: 0, totalExpense: 0, incomeCount: 0, expenseCount: 0 };
  result.forEach(({ _id, total, count }) => {
    if (_id === "income") {
      summary.totalIncome = total;
      summary.incomeCount = count;
    } else if (_id === "expense") {
      summary.totalExpense = total;
      summary.expenseCount = count;
    }
  });
  summary.netBalance = summary.totalIncome - summary.totalExpense;
  return summary;
};

// ------------------ DASHBOARD: BY CATEGORY --------------------------
export const getCategoryBreakdownService = async (userId) => {
  return Transaction.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId), isDeleted: false } },
    {
      $group: {
        _id: { category: "$category", type: "$type" },
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: "$_id.category",
        breakdown: {
          $push: { type: "$_id.type", total: "$total", count: "$count" },
        },
        categoryTotal: { $sum: "$total" },
      },
    },
    { $sort: { categoryTotal: -1 } },
  ]);
};

export const getMonthlyTrendsService = async (userId) => {
  return Transaction.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId), isDeleted: false } },
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" },
          type: "$type",
        },
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
  ]);
};

// ------------------ RESCENT TRANSACTIONS --------------------------
export const getRecentTransactionsService = async (userId, limit = 5) => {
  return Transaction.find({ userId })
    .sort({ date: -1 })
    .limit(Number(limit));
};

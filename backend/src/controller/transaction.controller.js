
import { createTransactionService, getAllTransactionsService,getTransactionByIdService,updateTransactionService,deleteTransactionService, getDashboardSummaryService ,getCategoryBreakdownService, getRecentTransactionsService, getMonthlyTrendsService } from "../services/transaction.services.js";
import { STATUS_CODES } from "../lib/constants.js";
import { errResponseBody, successResponseBody } from "../lib/responseBody.js";


export const createTransaction =async (req,res)=>{
    try {
        const transaction = await createTransactionService(req.body, req.user._id);
        return res
           .status(STATUS_CODES.created)
           .json(successResponseBody("Transaction created successfully", { transaction }));
    } catch (error) {
        console.error(error);
        if (error.err) {
             return res
                    .status(error.code || STATUS_CODES.internal_server_error)
                    .json(errResponseBody("Request failed", error.err));
         }
        return res.status(STATUS_CODES.internal_server_error).json(errResponseBody());
    }

}

export const getAllTransactions = async (req, res) => {
  try {
    const result = await getAllTransactionsService(req.user._id, req.query);
    return res
      .status(STATUS_CODES.ok)
      .json(successResponseBody("Transactions fetched successfully", result));
  } catch (error) {
    console.error(error);
    return res.status(STATUS_CODES.internal_server_error).json(errResponseBody());
  }
};


export const getTransactionById = async (req, res) => {
  try {
    const transaction = await getTransactionByIdService(req.params.id, req.user._id);
    return res
      .status(STATUS_CODES.ok)
      .json(successResponseBody("Transaction fetched successfully", { transaction }));
  } catch (error) {
    console.error(error);
    if (error.err) {
      return res
        .status(error.code || STATUS_CODES.internal_server_error)
        .json(errResponseBody("Request failed", error.err));
    }
    return res.status(STATUS_CODES.internal_server_error).json(errResponseBody());
  }
};


export const updateTransaction = async (req, res) => {
  try {
    const transaction = await updateTransactionService(req.params.id, req.user._id, req.body);
    return res
      .status(STATUS_CODES.ok)
      .json(successResponseBody("Transaction updated successfully", { transaction }));
  } catch (error) {
    console.error(error);
    if (error.err) {
      return res
        .status(error.code || STATUS_CODES.internal_server_error)
        .json(errResponseBody("Request failed", error.err));
    }
    return res.status(STATUS_CODES.internal_server_error).json(errResponseBody());
  }
};


export const deleteTransaction = async (req, res) => {
  try {
    await deleteTransactionService(req.params.id, req.user._id, req.user._id);
    return res
      .status(STATUS_CODES.ok)
      .json(successResponseBody("Transaction deleted successfully"));
  } catch (error) {
    console.error(error);
    if (error.err) {
      return res
        .status(error.code || STATUS_CODES.internal_server_error)
        .json(errResponseBody("Request failed", error.err));
    }
    return res.status(STATUS_CODES.internal_server_error).json(errResponseBody());
  }
};

export const getSummary = async (req, res) => {
  try {
    const summary = await getDashboardSummaryService(req.user._id);
    return res
      .status(STATUS_CODES.ok)
      .json(successResponseBody("Summary fetched successfully", summary));
  } catch (error) {
    console.error(error);
    return res.status(STATUS_CODES.internal_server_error).json(errResponseBody());
  }
};

export const getCategoryStats = async (req, res) => {
  try {
    const breakdown = await getCategoryBreakdownService(req.user._id);
    return res
      .status(STATUS_CODES.ok)
      .json(successResponseBody("Category breakdown fetched successfully", { breakdown }));
  } catch (error) {
    console.error(error);
    return res.status(STATUS_CODES.internal_server_error).json(errResponseBody());
  }
};

export const getTrends = async (req, res) => {
  try {
    const trends = await getMonthlyTrendsService(req.user._id);
    return res
      .status(STATUS_CODES.ok)
      .json(successResponseBody("Monthly trends fetched successfully", { trends }));
  } catch (error) {
    console.error(error);
    return res.status(STATUS_CODES.internal_server_error).json(errResponseBody());
  }
};

export const getRecent = async (req, res) => {
  try {
    const limit = req.query.limit || 5;
    const transactions = await getRecentTransactionsService(req.user._id, limit);
    return res
      .status(STATUS_CODES.ok)
      .json(successResponseBody("Recent transactions fetched successfully", { transactions }));
  } catch (error) {
    console.error(error);
    return res.status(STATUS_CODES.internal_server_error).json(errResponseBody());
  }
};
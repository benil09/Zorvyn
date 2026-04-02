
import { createTransactionService } from "../services/transaction.services.js";
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
import { createUser } from "../services/auth.services.js"
import { STATUS_CODES } from "../lib/constants.js";
import { errResponseBody,successResponseBody } from "../lib/responseBody.js";


export const signup = async (req,res)=>{
    try {
        const userData = req.body;
        const user = await createUser(userData);
        successResponseBody.data = user;
        successResponseBody.message = "User created successfully";
        res.status(STATUS_CODES.created).json(successResponseBody);
    } catch (error) {
        console.log(error);

        if(error.err){
            errResponseBody.err = error.err;
            return res.status(error.code || STATUS_CODES.internal_server_error).json(errResponseBody);
        }

        errResponseBody.err = error;
        res.status(STATUS_CODES.internal_server_error).json(errResponseBody);
    }
}
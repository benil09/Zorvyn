import User from "../models/user.model.js";
import { STATUS_CODES } from "../lib/constants.js";
export const createUser = async (userData)=>{
    try {
        if(!userData.email || !userData.password || !userData.name || !userData.dateOfBirth){
            throw { message: "All fields are required" , code: STATUS_CODES.bad_request};
        }
        const existingUser = await findUserByEmail(userData.email);
        if(existingUser){
            throw { message: "User with this email already exists" , code: STATUS_CODES.conflict};
        }
        const user = await User.create(userData);
        return user;
    } catch (error) {
        console.log(error)
        if(error.name === "ValidationError"){
            const err = {};
            Object.keys(error.errors).forEach((key)=>{
                err[key] = error.errors[key].message;
            })
            throw { message: "Validation Error" , code: STATUS_CODES.unprocessable_entity, err};
        }
        throw error;
    }
}

export const findUserByEmail = async (email)=>{
    try {
        const user = await User.findOne({email:email});
        return user;
    } catch (error) {
        throw error;
    }
}
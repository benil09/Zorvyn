import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { USER_ROLE } from "../lib/constants";
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate:{
            validator:function(value){
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value);
            },
            message:props=>`${props.value} is not a valid email address!`   
        },
        lowercase:true,
        trim:true
    },
    isEmailVerified:{
        type:Boolean,
        default:false
    },
    dateOfBirth:{
        type:Date,
        required:true
    },
    password:{
        type:String,
        required:true,
        minLength:6
    },
    role:{
        type:String,
        enum:{
            values:Object.values(USER_ROLE),
            message:`Role must be one of ${Object.values(USER_ROLE).join(", ")}`
        },
        default:USER_ROLE.VIEWER
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    deletedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:null
    }
},{
    timestamps:true
})

userSchema.pre('save',async function(){
    //trigger which is called before saving to encrypt the plain password
    const hash = await  bcrypt.hash(this.password,10);
    this.password = hash
})

userSchema.methods.isValidPassword = async function(password){
    const currentUser = this;
    const compare = await bcrypt.compare(password,currentUser.password)
    return compare;
}

const User = mongoose.model("User",userSchema);
export default User;
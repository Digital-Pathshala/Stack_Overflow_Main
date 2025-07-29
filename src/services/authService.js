import bcrypt from "bcryptjs";
import User from "../models/User";
import { generateOtp } from "../utils/generateOtp";
import { sendMail } from "../utils/senMail";

const register = async (data)=>{
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = new User({
        fullName: data.fullName,
        email: data.email,
        password: hashedPassword,
        confirmPassword: hashedPassword
    });

    const email = data.email

    const userExist = await User.findOne({email})

    if(userExist){
        new Error("user already exists.")
    }

    return await User.create({
        email: email,
        fullName: data.fullName,
        password: hashedPassword,

    })
}


const login = async (data)=>{
    const doEmailExist = await User.find({email:data.email})

    if(!doEmailExist.length > 0){
        throw new Error("Invalid email this User doesn't exist")
    }

    const dbPassword = doEmailExist[0].password

    const isPasswordMatch = bcrypt.compareSync(data.password,dbPassword)

    if(isPasswordMatch){
        return doEmailExist[0];
    }else{
        throw new Error("invalid password")
    }

}


const forgotPassword = async(data)=>{
    const userRegistered = await User.findOne({email:data.email})

    if(!userRegistered){throw new Error("Invalid Request.")}

    const otp = generateOtp();

    sendMail(data.email,otp)

    return

}

export default { register, login, forgotPassword }
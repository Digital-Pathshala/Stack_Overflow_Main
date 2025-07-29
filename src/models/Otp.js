import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({

    email:{
        type: String,
        unique: true,
        required: true
    },

    otp:{
        type: Number,
        unique: true,
        required: true
    }, 
    createdAt: {
        type: Date,
        default: new Date(),
        expires: 60
    },

});

export default mongoose.model("Otp", otpSchema) 
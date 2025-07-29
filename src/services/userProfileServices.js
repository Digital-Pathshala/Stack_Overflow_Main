import userProfile from "../models/UserProfile.js";
import mongoose from "mongoose";

const createProfile = async (data) => {

    return await userProfile.create(data);
};

const getAllProfile = async () => {
    return await userProfile.find({});
};


const getProfileById = async (id) => {
    // Validate ObjectId format before querying
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
    }
    return await userProfile.findById(id);
};


const updateProfileById = async (data,id) => {
    return await Product.findByIdAndUpdate(id, data);
}


export default { createProfile, getAllProfile, getProfileById, updateProfileById};
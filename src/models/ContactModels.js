import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    phone:{
        type: String,
        required: true
    },
    subject : {
        type : String, 
        required : true
    },
    queries: {
        type: String,
    }    

})
const contact = mongoose.model("contact",contactSchema)

export default contact;
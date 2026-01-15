import mongoose from "mongoose";

const ContentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    access: { 
        type: String, 
        enum: ["free", "premium"] ,
        default: "free"
    },
    averageRating: { 
        type: Number, 
        default: 0 
    }
}, {timestamps: true});

const Content = mongoose.model("Content", ContentSchema);
export default Content;
import mongoose from "mongoose";

const TokenSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        expires: 900,
    },
}, {timestamps: true});

const Token = mongoose.model("Token", TokenSchema);
export default Token;
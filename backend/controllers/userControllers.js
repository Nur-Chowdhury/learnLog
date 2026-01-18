import User from "../models/User.js";

export const getCurrentUser = async (req, res) => {
    try {
        const id = req.user.id;
        const user = await User.findById(id).select("-password");
        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        res.status(500).json({message: "Internal Server error"});
    }
}
import Rating from "../models/Rating.js";
import Content from "../models/Content.js";
import { hasActiveSubscription } from "../utils/checkSubscription.js";

export const rateContent = async (req, res) => {
    try {
        const user = req.user;
        const { contentId } = req.params;
        const { rating } = req.body;
        const isSubscribed = await hasActiveSubscription(user.id);

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" });
        }

        const content = await Content.findById(contentId);
        if (!content) {
            return res.status(404).json({ message: "Content not found" });
        }

        if (content.access === "premium" && user.role !== "admin" && !isSubscribed) {
            return res.status(403).json({ message: "Only subscribers can rate premium content" });
        }

        const ratingDoc = await Rating.findOneAndUpdate(
            { user: user.id, content: contentId },
            { rating },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.status(201).json({message: "Rating submitted successfully", rating: ratingDoc});
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "You already rated this content" });
        }
        res.status(500).json({ message: "Server Error" });
    }
};

export const getContentRatings = async (req, res) => {
    try {
        const { contentId } = req.params;

        const ratings = await Rating.find({ content: contentId })
        .populate("user", "name")
        .sort({ createdAt: -1 });

        const avgRating = ratings.length === 0
            ? 0
            : (
                ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
            ).toFixed(1);

        res.json({
            totalRatings: ratings.length,
            averageRating: Number(avgRating),
            ratings
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

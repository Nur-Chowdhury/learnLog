import Content from '../models/Content.js';
import User from '../models/User.js';
import { hasActiveSubscription } from '../utils/checkSubscription.js';

export const createContent = async (req, res) => {
    try {
        const user = req.user;
        if (user.role !== 'admin') {
            return res.status(403).json({ message: "Forbidden: Admins only!" });
        }

        const { title, description, access } = req.body;
        if(!title || !description || !access) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const slug = `${title} ${description} ${access}`.toLowerCase().replace(/\s+/g, "-");

        const content = await Content.create({ title, description, access, slug });
        res.status(201).json(content);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
}

export const getContents = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const isSubscribed = await hasActiveSubscription(user.id);

        const contents = user.role === "admin" || isSubscribed
            ? await Content.find()
            : await Content.find({ access: "free" });

        res.json(contents);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

export const getContentById = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const { id } = req.params;
        const isSubscribed = await hasActiveSubscription(user.id);

        const content = await Content.findById(id);
        if (!content) {
            return res.status(404).json({ message: "Content not found!" });
        }
        if (content.access === 'premium' && user.role !== 'admin' && !isSubscribed) {
            return res.status(403).json({message: "Upgrade to access premium content"});
        }
        res.json(content);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

export const searchContent = async (req, res) => {
    try {
        const { q, page = 0 } = req.query;
        const isSubscribed = await hasActiveSubscription(req.user.id);

        if (!q) {
            return res.status(400).json({message: "Search query is required!"});
        }

        const slugQuery = q.toLowerCase().replace(/ /g, '-');

        const limit = 15;
        const skip = parseInt(page, 10) * limit;

        const contents = isSubscribed
            ? await Content.find({
                slug: { $regex: slugQuery, $options: "i" }
            })
            .skip(skip)
            .limit(limit)
            : await Content.find({
                access: "free",
                slug: { $regex: slugQuery, $options: "i" }
            })
            .skip(skip)
            .limit(limit);
        res.json(contents);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

export const updateContent = async (req, res) => {
    try {
        const user = req.user;
        if (user.role !== 'admin') {
            return res.status(403).json({ message: "Forbidden: Admins only!" });
        }

        const { id } = req.params;
        const { title, description, access } = req.body;

        const slug = `${title} ${description} ${access}`.toLowerCase().replace(/\s+/g, "-");

        const updatedContent = await Content.findByIdAndUpdate(
            id,
            { title, description, access, slug },
            { new: true }
        );
        res.json(updatedContent);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

export const deleteContent = async (req, res) => {
    try {
        const user = req.user;
        if (user.role !== 'admin') {
            return res.status(403).json({ message: "Forbidden: Admins only!" });
        }

        const { id } = req.params;
        await Content.findByIdAndDelete(id);
        res.json({ message: "Content deleted successfully!" });
    } catch (error) {
        res.status(500).json({message: "Server Error"});
    }
};
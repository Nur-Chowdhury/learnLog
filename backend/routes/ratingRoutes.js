import express from "express";
import {
    rateContent,
    getContentRatings
} from "../controllers/ratingControllers.js";
import { verifyUser } from "../middlewares/verifyUser.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Ratings
 *     description: Content rating APIs
 */

/**
 * @swagger
 * /api/ratings/{contentId}:
 *   post:
 *     summary: Rate a content
 *     description: Submit or update a rating (1–5) for a specific content.
 *     tags: [Ratings]
 *     parameters:
 *       - in: path
 *         name: contentId
 *         required: true
 *         example: 65abc123def4567890abcd12
 *         description: ID of the content to rate
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             rating: 5
 *     responses:
 *       201:
 *         description: Rating submitted successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Rating submitted successfully
 *               rating:
 *                 _id: 66abc123def4567890abcd99
 *                 user: 64b1234abcde567890f12345
 *                 content: 65abc123def4567890abcd12
 *                 rating: 5
 *                 createdAt: 2026-01-18T06:45:23.123Z
 *       400:
 *         description: Invalid rating or already rated
 *       403:
 *         description: Only subscribers can rate premium content
 *       404:
 *         description: Content not found
 */
router.post("/:contentId", verifyUser, rateContent);

/**
 * @swagger
 * /api/ratings/{contentId}:
 *   get:
 *     summary: Get ratings of a content
 *     description: Fetch all ratings and average rating for a specific content.
 *     tags: [Ratings]
 *     parameters:
 *       - in: path
 *         name: contentId
 *         required: true
 *         example: 65abc123def4567890abcd12
 *         description: ID of the content
 *     responses:
 *       200:
 *         description: Ratings fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               totalRatings: 3
 *               averageRating: 4.3
 *               ratings:
 *                 - _id: 66abc123def4567890abcd01
 *                   rating: 5
 *                   user:
 *                     _id: 64b1234abcde567890f12345
 *                     name: John Doe
 *                   createdAt: 2026-01-18T05:20:10.000Z
 *                 - _id: 66abc123def4567890abcd02
 *                   rating: 4
 *                   user:
 *                     _id: 64b9999abcde567890f99999
 *                     name: Jane Smith
 *                   createdAt: 2026-01-17T12:10:30.000Z
 *       500:
 *         description: Server error
 */
router.get("/:contentId", verifyUser, getContentRatings);

export default router;
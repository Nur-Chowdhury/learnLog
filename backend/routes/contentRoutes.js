import express from "express";
import {
    createContent,
    deleteContent,
    getContentById,
    getContents,
    searchContent,
    updateContent
} from "../controllers/contentControllers.js";
import { verifyUser } from "../middlewares/verifyUser.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Content
 *     description: Content management APIs
 */

/**
 * @swagger
 * /api/contents:
 *   get:
 *     summary: Get all accessible contents
 *     tags: [Content]
 *     responses:
 *       200:
 *         description: List of contents
 */
router.get("/", verifyUser, getContents);

/**
 * @swagger
 * /api/contents/search:
 *   get:
 *     summary: Search contents
 *     tags: [Content]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         example: javascript
 *       - in: query
 *         name: page
 *         example: 0
 *     responses:
 *       200:
 *         description: Search results
 */
router.get("/search", verifyUser, searchContent);

/**
 * @swagger
 * /api/contents/{id}:
 *   get:
 *     summary: Get content by ID
 *     tags: [Content]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         example: 65abc123def4567890abcd12
 *     responses:
 *       200:
 *         description: Content found
 *       403:
 *         description: Premium access required
 */
router.get("/:id", verifyUser, getContentById);

/**
 * @swagger
 * /api/contents:
 *   post:
 *     summary: Create content (Admin only)
 *     tags: [Content]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             title: Intro to Node.js
 *             description: Learn backend with Node
 *             access: premium
 *     responses:
 *       201:
 *         description: Content created
 */
router.post("/", verifyUser, createContent);

/**
 * @swagger
 * /api/contents/{id}:
 *   put:
 *     summary: Update content (Admin only)
 *     tags: [Content]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         example: 65abc123def4567890abcd12
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             title: Updated title
 *             access: free
 *     responses:
 *       200:
 *         description: Content updated
 */
router.put("/:id", verifyUser, updateContent);

/**
 * @swagger
 * /api/contents/{id}:
 *   delete:
 *     summary: Delete content (Admin only)
 *     tags: [Content]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         example: 65abc123def4567890abcd12
 *     responses:
 *       200:
 *         description: Content deleted
 */
router.delete("/:id", verifyUser, deleteContent);

export default router;
import express from "express";
import {
    createContent,
    deleteContent,
    getContentById,
    getContents,
    searchContent,
    updateContent
} from "../controllers/contentControllers.js";
import { verifyUser } from "../middlewares/VerifyUser.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Content
 *   description: Content management APIs
 */

/**
 * @swagger
 * /api/contents:
 *   get:
 *     summary: Get all accessible contents
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of contents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Content'
 */
router.get("/", verifyUser, getContents);

/**
 * @swagger
 * /api/contents/search:
 *   get:
 *     summary: Search contents
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search keyword
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           default: 0
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
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Content found
 *       403:
 *         description: Premium access required
 *       404:
 *         description: Content not found
 */
router.get("/:id", verifyUser, getContentById);

/**
 * @swagger
 * /api/contents:
 *   post:
 *     summary: Create content (Admin only)
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - access
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               access:
 *                 type: string
 *                 enum: [free, premium]
 *     responses:
 *       201:
 *         description: Content created successfully
 *       403:
 *         description: Admin only
 */
router.post("/", verifyUser, createContent);

/**
 * @swagger
 * /api/contents/{id}:
 *   put:
 *     summary: Update content (Admin only)
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               access:
 *                 type: string
 *                 enum: [free, premium]
 *     responses:
 *       200:
 *         description: Content updated
 *       403:
 *         description: Admin only
 */
router.put("/:id", verifyUser, updateContent);

/**
 * @swagger
 * /api/contents/{id}:
 *   delete:
 *     summary: Delete content (Admin only)
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Content deleted successfully
 *       403:
 *         description: Admin only
 */
router.delete("/:id", verifyUser, deleteContent);

export default router;

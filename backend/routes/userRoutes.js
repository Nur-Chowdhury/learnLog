import express from 'express';
import { getCurrentUser } from '../controllers/userControllers.js';
import { verifyUser } from '../middlewares/verifyUser.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: User
 *     description: User profile related APIs
 */

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get current user profile
 *     description: Returns the profile information of the currently authenticated user.
 *     tags: [User]
 *     responses:
 *       200:
 *         description: User profile fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               user:
 *                 _id: 64b1234abcde567890f12345
 *                 name: John Doe
 *                 email: john@example.com
 *                 role: learner
 *                 isEmailVerified: true
 *                 createdAt: 2026-01-16T04:23:45.678Z
 *                 updatedAt: 2026-01-18T09:10:12.456Z
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *       500:
 *         description: Internal server error
 */
router.get('/me', verifyUser, getCurrentUser);

export default router;

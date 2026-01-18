import express from "express";
import {
    loginController,
    logoutController,
    registerController,
    verifyEmailController,
} from "../controllers/authControllers.js";
import { verifyUser } from "../middlewares/verifyUser.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User authentication and authorization APIs
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: John Doe
 *             email: john@example.com
 *             password: StrongPassword123
 *     responses:
 *       201:
 *         description: Registration successful. Verification email sent.
 *         content:
 *           application/json:
 *             example:
 *               message: Registration successful! Please check your email.
 *       400:
 *         description: Invalid input
 *       409:
 *         description: User already exists
 */
router.post("/register", registerController);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             email: john@example.com
 *             password: StrongPassword123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             example:
 *               message: Login successful
 *               user:
 *                 id: 64b1234abcde567890f12345
 *                 name: John Doe
 *                 role: learner
 *               token: jwt_token_here
 *       401:
 *         description: Unauthorized
 */
router.post("/login", loginController);

/**
 * @swagger
 * /api/auth/verify/{id}/{token}:
 *   get:
 *     summary: Verify email
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         example: 64b1234abcde567890f12345
 *       - in: path
 *         name: token
 *         required: true
 *         example: email_verification_token
 *     responses:
 *       200:
 *         description: Email verified
 *         content:
 *           application/json:
 *             example:
 *               message: Email verified successfully
 */
router.get("/verify/:id/:token", verifyEmailController);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             example:
 *               message: Logout successful
 */
router.post("/logout", verifyUser, logoutController);

export default router;
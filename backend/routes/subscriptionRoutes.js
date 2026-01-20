import express from "express";
import {
    cancelledPayment,
    cancelSubscription,
    getMySubscription,
    startSubscription,
    successPayment
} from "../controllers/subscriptionControllers.js";
import { verifyUser } from "../middlewares/verifyUser.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Subscription
 *     description: Subscription and billing APIs
 */

/**
 * @swagger
 * /api/subscriptions/subscribe:
 *   post:
 *     summary: Start a subscription
 *     tags: [Subscription]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             plan: monthly
 *     responses:
 *       200:
 *         description: Redirects to Stripe checkout
 */
router.post("/subscribe", verifyUser, startSubscription);

/**
 * @swagger
 * /api/subscriptions/me:
 *   get:
 *     summary: Get my active subscription
 *     tags: [Subscription]
 *     responses:
 *       200:
 *         description: Active subscription details
 *       404:
 *         description: No active subscription
 */
router.get("/me", verifyUser, getMySubscription);

/**
 * @swagger
 * /api/subscriptions/cancel:
 *   delete:
 *     summary: Cancel active subscription
 *     tags: [Subscription]
 *     responses:
 *       200:
 *         description: Subscription cancelled
 */
router.delete("/cancel", verifyUser, cancelSubscription);

router.get("/payment-success", verifyUser, successPayment);
router.get("/payment-cancelled", verifyUser, cancelledPayment);

export default router;
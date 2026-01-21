import express, { Router } from "express";
import { cancelSubscription, changePlan, createCheckoutSession, createCustomerPortalSession, getAllSubscriptions, getUserSubscription, stripeWebhook } from "../controllers/subscription.controller.js";
import {authorize} from "../middlewares/auth.middleware.js";

const subscriptionRouter = Router();

subscriptionRouter.get('/', authorize, getAllSubscriptions);

subscriptionRouter.get('/user/:id', authorize, getUserSubscription);

subscriptionRouter.post('/create-checkout-session', authorize, createCheckoutSession);

subscriptionRouter.post('/create-customer-portal-session', authorize, createCustomerPortalSession);

subscriptionRouter.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

subscriptionRouter.put('/change', authorize, changePlan);

subscriptionRouter.put('/cancel', authorize, cancelSubscription);

export default subscriptionRouter;
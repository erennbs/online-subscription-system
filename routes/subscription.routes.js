import { Router } from "express";
import { createSubscription, getUserSubscription } from "../controllers/subscription.controller.js";
import authorize from "../middlewares/auth.middleware.js";

const subscriptionRouter = Router();

subscriptionRouter.get('/', (req, res) => {});

subscriptionRouter.get('/:id', (req, res) => {});

subscriptionRouter.post('/', authorize, createSubscription);

subscriptionRouter.put('/:id', (req, res) => {});

subscriptionRouter.delete('/:id', (req, res) => {});

subscriptionRouter.get('/user/:id', authorize, getUserSubscription);

subscriptionRouter.put('/:id/cancel', (req, res) => {});

subscriptionRouter.get('/upcoming-renewals', (req, res) => {});

export default subscriptionRouter;
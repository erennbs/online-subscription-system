import mongoose from 'mongoose';
import Subscription from '../models/subscription.model.js';
import SubscriptionPlan from '../models/subscriptionPlan.model.js';

export const getAllSubscriptions = async (req, res, next) => {
    try {
        const subs = await Subscription.find();

        res.status(200).json({success: true, data: subs})
    } catch (error) {
        
    }
}

export const createSubscription = async (req, res, next) => {
    try {
        const plan = await SubscriptionPlan.findById(req.body.planId);

        if (!plan) {
            const error = new Error("Plan not found");
            error.statusCode = 404;
            throw error;
        }

        const now = Date.now();

        const subscription = {
            userId: req.user.id,
            planId: req.body.planId,
            status: "active",
            currentPeriodStart: now,
            currentPeriodEnd: now + plan.interval == "month" ? 30 : 365,
            cancelAtPeriodEnd: false
        };

        const newSubscription = await Subscription.create(subscription);

        res.status(201).json({success: true, data: newSubscription});
    } catch (error) {
        next(error);
    }
}

export const getUserSubscription = async (req, res, next) => {
    try {
        if(req.user.id !== req.params.id) {
            const error = new Error("You are not the owner of this account");
            error.statusCode = 401;
            throw error;
        }
        const subscriptions = await Subscription.findOne({user: req.params.id, active: true});

        if (!subscriptions) {
            const error = new Error("No subscription found");
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({sucess: true, data: subscriptions});
    } catch (error) {
        next(error)
    }
}

export const cancelSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findOne({userId: req.user.id, status: "active"});

        if (!subscription) {
            const error = new Error("No subscription found");
            error.statusCode = 404;
            throw error;
        }

        subscription.cancelAtPeriodEnd = true;

        subscription.save();

        res.status(200).json({success: true, message: "Subscription canceled successfully"});
    } catch (error) {
        next(error)
    }
}

export const changePlan = async (res, req, next) => {
    
}
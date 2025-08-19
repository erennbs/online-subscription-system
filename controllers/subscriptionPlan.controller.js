import mongoose from "mongoose";
import SubscriptionPlan from "../models/subscriptionPlan.model.js";
import { stripe } from "../config/stripe.js";

export const getSubscriptionPlans = async (req, res, next) => {
    try {
        const plans = await SubscriptionPlan.find();

        res.json({success: true, data: plans});
    } catch (error) {
        next(error);
    }
}

export const getSubscriptionPlan = async (req, res, next) => {
    try {
        const plan = await SubscriptionPlan.findById(req.params.id);

        if(!plan) {
            const error = new Error("Plan not found");
            error.statusCode = 404;
            throw error;
        }

        res.json({success: true, data: plan});
    } catch (error) {
        next(error);
    }
}

export const createSubscriptionPlan = async (req, res, next) => {
    try {
        session.startTransaction();
        const price = await stripe.prices.create({
            currency: "usd",
            unit_amount: req.body.priceUSD * 100,
            recurring: {
                interval: req.body.interval
            },
            product_data: {
                name: req.body.name
            }
        })
        
        const plan = await SubscriptionPlan.create({...req.body, stripePriceId: price.id});

        res.status(201).json({success: true, data: plan});
    } catch (error) {
        next(error)
    }
}

export const updateSubscriptionPlan = async (req, res, next) => {
    try {
        const plan = await SubscriptionPlan.findById(req.params.id);

        if(!plan) {
            const error = new Error("Plan not found");
            error.statusCode = 404;
            throw error;
        }

        await SubscriptionPlan.updateOne({_id: plan.id}, req.body);

        res.status(200).json({success: true, message: "Plan updated successfully", data: req.body});

    } catch (error) {
        next(error);
    }
}

export const deleteSubscriptionPlan = async (req, res, next) => {
    try {
        const plan = await SubscriptionPlan.findById(req.params.id);
        
        if(!plan) {
            const error = new Error("Plan not found");
            error.statusCode = 404;
            throw error;
        }

        await SubscriptionPlan.findByIdAndDelete(req.params.id);

        res.status(204).json({success: true, message: "Plan deleted successfully"});
    } catch (error) {
        next(error);
    }
}
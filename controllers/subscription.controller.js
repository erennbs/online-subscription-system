import mongoose from 'mongoose';
import Subscription from '../models/subscription.model.js';
import SubscriptionPlan from '../models/subscriptionPlan.model.js';
import {stripe} from '../config/stripe.js';
import { STRIPE_WEBHOOK_SECRET } from '../config/env.js';
import User from '../models/user.model.js';

export const getAllSubscriptions = async (req, res, next) => {
    try {
        const subs = await Subscription.find();

        res.status(200).json({success: true, data: subs})
    } catch (error) {
        
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

        await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
            cancel_at_period_end: true
        })

        subscription.cancelAtPeriodEnd = true;

        subscription.save();

        res.status(200).json({success: true, message: "Subscription canceled successfully"});
    } catch (error) {
        next(error)
    }
}

export const createCheckoutSession = async (req, res, next) => {
    try {
        session.startTransaction()
        const plan = await SubscriptionPlan.findById(req.body.planId);
        
        if (!plan) {
            const error = new Error("Plan not found");
            error.statusCode = 404;
            throw error;
        }
        
        const stripeCustomerId = req.user.stripeCustomerId

        const stripeSession = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            customer: stripeCustomerId,
            line_items: [
                {
                price: plan.stripePriceId,
                quantity: 1,
                },
            ],
            
            success_url: 'https://example.com/success.html?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'https://example.com/canceled.html',
        });

        res.json( {data: stripeSession.url});
    } catch (error) {
        next(error);
    }
}

export const stripeWebhook = async (req, res, next) => {
    let data;
    let eventType;

    const webhookSecret = STRIPE_WEBHOOK_SECRET;
    if (webhookSecret) {
        let event;
        let signature = req.headers["stripe-signature"];

        try {
            event = stripe.webhooks.constructEvent(
                req.rawBody,
                signature,
                webhookSecret
            );
        } catch (err) {
            console.log(err);
            console.log(`⚠️  Webhook signature verification failed.`);
            return res.sendStatus(400);
        }

        data = event.data;
        eventType = event.type;
    } else {
        // Webhook signing is recommended, but if the secret is not configured in `config.js`,
        // retrieve the event data directly from the request body.
        data = req.body.data;
        eventType = req.body.type;
    }
    const user = await User.findOne({stripeCustomerId: data.object.customer});
    
    switch (eventType) {
        case 'checkout.session.completed':
            // Payment is successful and the subscription is created
            break;
            case 'customer.subscription.created':
                // Continue to provision the subscription as payments continue to be made.
            const plan = await SubscriptionPlan.findOne({stripePriceId: data.object.plan.id});
            
            const startDate = Date.now();
            const end = new Date(startDate);
            end.setMonth(end.getMonth() + (plan.interval == "month" ? 1 : 12));

            const subscription = {
                userId: user._id,
                planId: plan._id,
                status: "active",
                currentPeriodStart: startDate,
                currentPeriodEnd: end,
                cancelAtPeriodEnd: false,
            };

            await Subscription.create(subscription);
        break;
        case 'customer.subscription.deleted':
            console.log("Cancelled");
            
            const subscipritonToCancel = await Subscription.findOne({stripeSubscriptionId: data.object.id, status: "active"});
            subscipritonToCancel.status = "canceled";
            subscipritonToCancel.save();
        break;
        case 'invoice.payment_failed':
        // The payment failed or the customer does not have a valid payment method.
            const sub = await Subscription.findOne({userId: user._id});
            if (sub) {
                sub.status = "onhold";
                sub.save();
            }
        break;
        default:
        // Unhandled event type
  }

  res.sendStatus(200);
}

export const changePlan = async (res, req, next) => {
    
}
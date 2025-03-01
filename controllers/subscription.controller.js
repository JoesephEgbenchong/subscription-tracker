import { SERVER_URL } from '../config/env.js';
import { workflowClient } from '../config/upstash.js';
import Subscription from '../models/subscription.model.js';

export const createSubscription = async (req, res, next) => {
    try {

        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id,
        });

        const { workflowRunId } = await workflowClient.trigger({
            url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
            body: {
                subscriptionId: subscription.id,
            },
            headers: {
                "content-type": "application/json",
            },
            retries: 0,
        });

        res.status(201).json({ success: true, message: 'Subscription created successfully' , data: { subscription, workflowRunId } });
    } catch (error) {
        next(error);
    }
}

export const getUserSubscriptions = async (req, res, next) => {
    try {
        
        console.log(`user id: ${req.user.id}`);
        console.log(`params id: ${req.params.userId}`);
        if (!req.params.userId) {
            const error = new Error('Missing route parameter: userId');
            error.status = 400;
            throw error;
        }
        if (req.user.id !== req.params.userId) {
            const error = new Error('You are not the owner of this account');
            error.status = 401;
            throw error;
        }

        const subscriptions = await Subscription.find({ user: req.params.userId });

        res.status(200).json({ success: true, data: subscriptions });
    } catch (error) {
        next(error);
    }
}
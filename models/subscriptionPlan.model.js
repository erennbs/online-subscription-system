import mongoose from "mongoose";

const subscriptionPlanSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Plan name is required"],
        trim: true,
        minLength: 2,
        maxLength: 50,
    },

    priceUSD: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price must be greater than 0"],
    },

    interval: {
        type: String,
        enum: ["month", "year"]
    },
    
    features: { 
        type: String 
    },

    isFree: { 
        type: Boolean, 
        default: false 
    },
    
    isActive: {
        type: Boolean,
        default: true
    }

}, {timestamps: true});

const SubscriptionPlan = mongoose.model("SubscriptionPlan", subscriptionPlanSchema);

export default SubscriptionPlan;
import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    planId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubscriptionPlan",
        required: true,
        index: true
    },
    status: {
        type: String,
        enum: ["active", "canceled", "expired", "onhold"],
        default: "active",
        index: true
    },
    currentPeriodStart: {
        type: Date,
        required: true,
        validate: {
            validator: (value) => value <= Date.now(),
            message: "Start date can't be future data"
        }
    },
    currentPeriodEnd: {
        type: Date,
        required: false,
        validate: {
            validator: function (value) { 
                return value > this.currentPeriodStart
            },
            message: "Renewal date can't be past date"
        }
    },
    cancelAtPeriodEnd: {
        type: Boolean,
        default: false
    },
    stripeSubscriptionId: {
        type: String
    }
}, {timestamps: true});

const Subscripton = mongoose.model("Subscription", subscriptionSchema);

export default Subscripton
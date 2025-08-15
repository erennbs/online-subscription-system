import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 100
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price must be greater than 0"],
    },
    currency: {
        type: String,
        enum: ["USD", "EUR", "GBP"],
        default: ["USD"]
    },
    frequency: {
        type: String,
        enum: ["daily", "weekly", "monthly", "yearly"]
    },
    category: {
        type: String,
        enum: ["sports", "news", "entartainment", "lifestyle", "tech", "finance", "politics", "other"],
        required: true
    },
    paymentMethod: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ["active", "cancelled", "expired"],
        default: "active"
    },
    startDate: {
        type: Date,
        required: true,
        validate: {
            validator: (value) => value <= Date.now,
            message: "Start date can't be future data"
        }
    },
    renewalDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) { 
                return value > this.startDate
            },
            message: "Renewal date can't be past date"
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    }
}, {timestamps: true});

subscriptionSchema.pre('save', (next) => {
    if(!this.renewalDate) {
        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365,
        };

        this.renewalDate = new Date(this.startDate),
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
    }
    
    if(this.renewalDate < Date.now) {
        this.status = "expired";
    }
    
    next();
});

const Subscripton = mongoose.model("Subscription", subscriptionSchema);

export default Subscripton
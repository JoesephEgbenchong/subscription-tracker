import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Subsciption Name is required'],
        trim: true,
        minLength: [3, 'Name must be at least 3 characters long'],
        maxLength: [50, 'Name must be at most 50 characters long'],
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative'],
    },
    currency: {
        type: String,
        enum: ['USD', 'EUR', 'GBP'],
        default: 'USD',
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly'],
        default: 'monthly',
    },
    category: {
        type: String,
        enum: ['entertainment', 'education', 'health', 'fitness', 'finance', 'other'],
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ['active', 'cancelled', 'trial', 'expired'],
        default: 'active',
    },
    startDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return value <= new Date();
            },
            message: 'Start date cannot be in the future',
        },
    },
    renewalDate: {
        type: Date,
        validate: {
            validator: function (value) {
                return value >= this.startDate;
            },
            message: 'Renewal date cannot be before the start date',
        },
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
}, { timestamps: true });

//Auto-calculate renewal date if missing
subscriptionSchema.pre('save', function (next) {
    if(!this.renewalDate3) {
        let renewalDate = new Date(this.startDate);
        switch(this.frequency) {
            case 'daily':
                renewalDate.setDate(renewalDate.getDate() + 1);
                break;
            case 'weekly':
                renewalDate.setDate(renewalDate.getDate() + 7);
                break;
            case 'monthly':
                renewalDate.setMonth(renewalDate.getMonth() + 1);
                break;
            case 'yearly':
                renewalDate.setFullYear(renewalDate.getFullYear() + 1);
                break;
        }
        this.renewalDate = renewalDate;
    }

    //Auto-update status if renewal date is in the past
    if(this.renewalDate < new Date()) {
        this.status = 'expired';
    }

    next();
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;
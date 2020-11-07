const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubscriptionSchema=new mongoose.Schema({
    price : {
        type: String,
        required: true
    },
    timeperiod : {
        type: String,
        required: true
    },
},
{
    timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}
}
);


module.exports = Subscription = mongoose.model('Subscription', SubscriptionSchema);
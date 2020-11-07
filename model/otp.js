const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OtpSchema=new mongoose.Schema({
    otp: {
        type: String,
        // required: true
    },
    number :{
        type : String
    },
    expire_at: {
        type: Date, 
        default: Date.now, 
        expires: '10m'
    } 
},
{
    timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}
}
);

// OtpSchema.index({createdAt: 1},{expireAfterSeconds: 36});

module.exports = Opt = mongoose.model('Otp', OtpSchema);
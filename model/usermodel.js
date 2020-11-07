const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema=new mongoose.Schema({
    name: {
        type: String,
        // required: true
    },
    email: {
        type: String,
        // required: true
    },
    phone : {
        type : String
    },
    device_token : {
        type : String,
        // required : true
    },
    device_type : {
        type : String,
        // required : true
    },
    loginwith : {
        type : String,
        // required : true
    },
    on_off: {
        type: Boolean,
        default: false
    },
},
{
    timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}
}
);


module.exports = User = mongoose.model('User', UserSchema);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema=new mongoose.Schema({
    createdby : {
        type: String,
        required: true
    },
    keyword : {
        type: String,
        // required: true
    },
    number: {
        type: Number,
        // required: true
    },
    message: {
        type: String,
        // required: true
    },
    settime: {
        type: String,
        // required: true
    },
    image: {
        type: String,
        // required: true
    },
    map: {
        type: String,
        // required: true
    },
    name: {
        type: String,
        // required: true
    },
    value_on_off: {
        type: Boolean,
        // default: true
    },
    time: {
        type: String
    },
    spinner_value : {
        type: String
    }
},
{
    timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}
}
);


module.exports = Message = mongoose.model('Message', MessageSchema);
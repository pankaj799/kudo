const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sendMessagesSchema=new mongoose.Schema({
    user_id: {
        type: String,
        // required: true
    },
    name: {
        type: String,
        // required: true
    },
    package_name : {
        type : String
    },
    updatedday : {
        type : String
    },
    updatedtime : {
        type : String
    }
},
{
    timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}
}
);


module.exports = sendMessages = mongoose.model('sendMessages', sendMessagesSchema);
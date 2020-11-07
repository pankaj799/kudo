const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const loginSchema=new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
},
{
    timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}
}
);


module.exports = Login = mongoose.model('Login', loginSchema);
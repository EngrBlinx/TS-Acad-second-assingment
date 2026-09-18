const mongoose = require('mongoose');
const accountSchema = new mongoose.Schema({

        accountNumber: {
            type: Number,
            required: true
        },
        bankName: {
            type: String,
        },
        bankCode: {
            type: Number
        },
        balance: {
            type: Number,
        },
        status: {
            type: String,
            enum: [ 'active', 'inactive' ],
            default: 'active'
        }
    },
    
    {timestamps: true}

);

const accountModel = mongoose.model( 'Account', accountSchema, 'accounts');
module.exports = accountModel;
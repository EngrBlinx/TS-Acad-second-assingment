const mongoose = require('mongoose');
const accountSchema = new mongoose.Schema({

        accountNumber: {
            type: Number,
            required: true
        },
        balance: {
            type: Number,
            required: true
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
const mongoose = require('mongoose');
const staffSchema = new mongoose.Schema({

        firstname:{
            type: String,
            required: true
        },
        lastname:{
            type: String,
            required: true
        },
        email:{
            type: String,
            required: true
        },
        password:{
            type: String,
            required: true
        },
        role:{
            type: String,
            enum: [ 'cashier', 'accountant' ],
            default: 'cashier'
        }
    },
    
    {timestamps: true}

);

const staffModel = mongoose.model('Staff', 'staffSchema', 'staff' );
module.exports = staffModel;
const mongoose = require('mongoose');
const customerSchema = new mongoose.Schema({

        firstname: {
            type: String,
            required: true
        },
        lastname:{
            type: String,
            require: true
        },
        nin:{
            type: Number,
            require: true
        },
        dob: {
            type: Date,
            required: true
        }
    },   
        
    { timeseries: true }
);
const customerModel = mongoose.model('Customer', customerSchema, 'customers');
module.exports = customerModel;
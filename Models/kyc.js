const mongoose = require('mongoose');
const kycSchema = new mongoose.Schema({
        kycType: {
            type: String,
            enum: [ 'nin', 'bvn'],
            required: true
        },
        kycID: {
            type: Number,
            required: true
        },
        firstname: {
            type: String,
            required: true
        },
        lastname: {
            type: String,
            required: true
        },
        dob: {
            type: Date,
            required: true
        }
    },
    { timestamps: true }
);

const kycModel = mongoose.model('Verification', kycSchema, 'verifications');
module.exports = kycModel;
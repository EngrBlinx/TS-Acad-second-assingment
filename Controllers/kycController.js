const { response } = require('express');
const Kyc = require('../Models/kyc');
const axios = require('axios');


//Onboard BVN
exports.onboardBvn = async (req, res) => {
    try {
        //Grab the fields from the request body by destructuring
        const { bvn, firstname, lastname, dob, phone } = req.body;
        
        //Check required fields
        if( !bvn || !firstname || !lastname || !dob || !phone ){
            return res.status(400).json({message: 'Please fill all required fields'});
        }

        const requestData = JSON.stringify({ bvn, firstname, lastname, dob, phone });

        //build the configuration for axios call
        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${process.env.API_URL}/api/insertBvn`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${process.env.API_KEY}`
            },
            data: requestData
        };

        //Call NIBSS
        const response = await axios.request(config);

        //Get the BVN from NIBSS reasponse data
        // This line is funny, because the bvn is not supposed to be part of the input data.
        //The input data should only be other identity info like FN, LN, DOB, the the upstream server
        // returns an auto-generated bvn in the response data

        ({ bvn }) = response.data;
        return res.status(201).json({ message: 'BVN created successfully', bvn });

    }catch (error) {
        if(error.response){
            console.error('Provider error:', error.response.status, error.response.data);
            return res.status(502).json({
                message: 'Error creating BVN with provider',
                error: error.response.data
            });
        }
        console.error(error)
        return res.status(500).json({message: 'Error creating BVN', error: error.message});
    }

};

//Onboard NIN
exports.onboardNin = async (req, res) => {
    try {
        //Grab the fields from the request body by destructuring
        const { nin, firstname, lastname, dob, phone } = req.body;
        
        //Check required fields
        if( !bvn || !firstname || !lastname || !dob || !phone ){
            return res.status(400).json({message: 'Please fill all required fields'});
        }

        const requestData = JSON.stringify({ bvn, firstname, lastname, dob, phone });

        //build the configuration for axios call
        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${process.env.API_URL}/api/insertNin`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${process.env.API_KEY}`
            },
            data: requestData
        };

        //Call NIBSS
        const response = await axios.request(config);

        //Get the NIN from NIBSS reasponse data
        // This line is funny, because the NIN is not supposed to be part of the input data.
        //The input data should only be other identity info like FN, LN, DOB, the the upstream server
        // returns an auto-generated NIN in the response data
        
        ({ nin  }) = response.data;
        return res.status(201).json({ message: 'NIN created successfully', bvn });

    }catch (error) {
        if(error.response){
            console.error('Provider error:', error.response.status, error.response.data);
            return res.status(502).json({
                message: 'Error creating NIN with provider',
                error: error.response.data
            });
        }
        console.error(error)
        return res.status(500).json({message: 'Error creating NIN ', error: error.message});
    }

};

//Valiadate NIN
exports.validateKyc = async (req, res) => {
    try{
        //Grab the NIN from the request body
        const { kycID } = req.params;

        const customer = await Kyc.findById({ kycID });

        if(!customer)
            return res.status(404).json({ message: ' NIN does not exist' });

        return res.status(200).json({ customer });

    }catch (error) {
        return res.status(500).json({ message: 'Could not validate NIN', error: error.message });
    }
};
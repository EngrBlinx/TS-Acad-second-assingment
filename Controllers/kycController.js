const Kyc = require('../Models/kyc');


//Onboard KYC
exports.onboardKyc = async (req, res) => {
    try {
        //Check required fields
        if(!nin || !firstname || !lastname || !dob){
            return res.status(400).json({message: 'Please fill all required fields'});
        }

        //Grab the fields from the request body by destructuring
        const { nin, firstname, lastname, dob } = req.body;

        //Create a new KYC object
        const kyc = new Kyc({ nin, firstname, lastname, dod });

        await kyc.save();
        return res.status(201).json({message: 'Kyc onboarded successfully', kyc})
    }catch (error) {
        return res.status(500).json({message: 'Internal server error', error: error.message});
    }

};

//Valiadate NIN
exports.validateNin = async (req, res) => {
    try{
        //Grab the NIN from the request body
        const { nin } = req.params;

        const customer = await Kyc.findById(nin);

        if(!customer)
            return res.status(404).json({message: ' NIN does not exist'});

        return res.status(200).json({ customer });

    }catch (error) {
        return res.status(500).json({message: 'Could not validate NIN', error: error.message});
    }
};
const Account = require('../Models/account');
const axios = require('axios');
const KYC = require('../Models/kyc');


exports.createAccount = async (req, res) => {
    try {
        const { kycType, kycID, dob } = req.body;

        if (!kycType || !kycID || !dob) {
            return res.status(400).json({ message: 'Please complete the remaining fields' });
        }

        const requestData = JSON.stringify({ kycType, kycID, dob });

        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${process.env.API_URL}/api/account/create`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${process.env.API_KEY}`
            },
            data: requestData
        };

        // call the external provider(NIBSS) and WAIT for the created account details
        const response = await axios.request(config);

    // +-----------------------------------------------------------------------------------------------+
    // |  What I understand is that, at this point, before NIBSS even sends their response, they must  |
    // |  have added the now-generated account nmber, bankName, and bankCode to the KYC document,      |
    // |  which will later be used for inter-bank name enquiry during inter-bank transfers.            |
    // +-----------------------------------------------------------------------------------------------+
        const { accountNumber, fintech: {bankCode}, fintech: {bankName} } = response.data;

        if (!accountNumber) {
            return res.status(502).json({ message: 'Provider did not return an account number' });
        }

        // Save the account the provider created into our own DB
        const account = await Account.create({
            accountNumber,
            bankCode: bankCode,
            bankName: bankName,
            balance: 15000,
            status: 'active'
        });

        return res.status(201).json({
            message: 'Account created successfully',
            accountNumber: account.accountNumber,
            bankCode: account.bankCode,
            bankName: account.bankName,
            balance: account.balance
        });

    } catch (error) {
        // axios throws on non-2xx responses; error.response holds the provider's error body
        if (error.response) {
            console.error('Provider error:', error.response.status, error.response.data);
            return res.status(502).json({
                message: 'Error creating account with provider',
                error: error.response.data
            });
        }

        console.error(error);
        return res.status(500).json({ message: 'Error creating account', error: error.message });
    }
};

exports.nameEnquiry = async (req, res) => {
    try{
        // grab the account number
        const { accountNumber } = req.params;

        if(!accountNumber)
            return res.status(400).json({message: 'Please provide the account number'});

        //Assuming the KYC ID is save in the accounts collection
        const account = await Account.findOne({ accountNumber });

        if(!account)
            return res.status(404).json({ message: 'Account not found' });

        const identity = await KYC.findOne({ kycID: account.kycID });

        if(!identity)
            return res.status(404).json({ message: 'Identity not found'});

        const { firstname, lastname } = identity;

        const fullname = `${firstname} ${lastname}`;

        return res.status(200).json({ fullname });

        
    }catch(error){
        console.error(error);
        return res.status(500).json({ message: 'Error resolving name' });
    }
};
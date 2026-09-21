const Account = require('../Models/account');
const axios = require('axios');


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

        // call the external provider and WAIT for the created account details
        const response = await axios.request(config);

        const { accountNumber, bankCode, bankName } = response.data;

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
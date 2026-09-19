const Account = require('../Models/account');
const Kyc = require('../Models/kyc');
const generateNUBAN = require('../utils/nuban');

exports.createAccount = async (req, res) => {
    //Grab the data from the request body
    const { kycType, kycID, dob } = req.body;

    try{
        if (!kycType || !kycID || !dob){
            return res.status(400).json({message: 'Please complete the remaining fields'});
        }

        //grab the data in the decoded token
        const { bankName, bankCode } = req.user;

        //generate account number
        const accountNumber = await generateNUBAN(bankCode);

        //Create the account
        const account = await Account.create({
            accountNumber,
            bankCode,
            bankName,
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
    }catch (error){
        return res.status(500).json({ message: 'Error creating account', error: error.message});
    }
}
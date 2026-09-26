const Staff = require('../Models/staff');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.createStaff = async (req, res) => {
    try{
        const { firstname, lastname, email, password, role } = req.body;

        //check for missing field
        if( !firstname || !lastname || !email || !password || !role ) 
            return res.status(400).json({ message: "Please complete all required fields" });

        //Check for existing user
        const existingStaff = await Staff.findOne({ email });
        if(existingStaff)
            return res.status(400).json({message: "Staff already Onboarded"});

        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password, salt);

        //create the staff
        const staff = new Staff({
            firstname,
            lastname,
            email,
            password: hashedpassword,
            role: role || 'cashier'
        });

        //Save the staff object on the DB
        await staff.save();
        return res.status(201).json({ message: 'Staff onboarded successfully', staff });
    }catch(error){
        console.error(error);
        return res.status(500).json({ message: "Error onboarding staff", error: error.message });
    }
};

exports.staffLogin = async (req, res) =>{
    try{
        const { email, password } = req.body;

        if(!email || !password)
            return res.status(400).json({ message: "Please complete all required fields" });

        // check if staff if user exists
        const existingStaff = await Staff.findOne({ email });
        if(!existingStaff)
            return res.status(404).json({ message: "Staff not fond" });

        //Check if password is correct
        const isPasswordValid = await bcrypt.compare(password, existingStaff.password);
        if(!isPasswordValid)
            return res.status(401).json({ message: "Your email and password did not match"});

        //generate a token
        const token = await jwt.sign({
                id: existingStaff._id,
                firstname: existingStaff.firstname,
                lastname: existingStaff.lastname,
                email: existingStaff.email,
                role: existingStaff.role,
                bankCode: process.env.BANK_CODE,
                bankName: process.env.BANK_NAME
            },
            process.env.API_KEY,
            process.env.API_SECRET,
            { expiresIn: '1h' }
        );
        return res.status(201).json({token});
    }catch(error){
        console.error(error);
        return res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};
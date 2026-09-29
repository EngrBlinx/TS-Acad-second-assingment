const express = require('express');
const app = express();
app.use(express.json());

const dotenv = require('dotenv');
dotenv.config();

const staffRoute = require('./Routes/staff');
app.use('/staff', staffRoute);

const accountRoute = require('./Routes/account');
app.use('/account', accountRoute);

const kycRoute = require('./Routes/kyc');
app.use('/bvn', kycRoute);
app.use('/nin', kycRoute);


const connectDB = require('./Config/dbconfig');
connectDB();

app.listen(process.env.PORT, () =>{
    console.log(`Server is running on port ${process.env.PORT}`);
});

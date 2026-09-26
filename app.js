const express = require('express');
const app = express();
app.use(express.json());

const dotenv = require('dotenv');
dotenv.config();

const staffRoute = require('./Routes/staff');
app.use('/staff', staffRoute);





const connectDB = require('./Config/dbconfig');
connectDB();

app.listen(process.env.PORT, () =>{
    console.log(`Server is running on port ${process.env.PORT}`);
});

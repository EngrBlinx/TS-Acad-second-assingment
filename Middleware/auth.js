const jwt = require('jsonwebtoken');

exports.protect = async (req, res, next) => {
    //Grab the token from the request header
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if(!token)
        return res.status(401).json({message: 'Can\'t perform this action, invalid token'});

    try{
        const decoded = await jwt.verify(token, process.env.API_KEY, process.env.API_SECRET);
        req.user = decoded;
    }catch (error){
        return res.status(401).json({ message: 'Not authorized', error: error.message });
    }
}
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const userDB = new User;

async function authenticateToken(req, res, next) {
    const { user_id, user_token} = req.headers;

    if(!user_token) {
        return res.status(200).json({invalidToken: 'Token não fornecido' })
    }

    try {
        const fetchUserToken = await userDB.fetchUserToken(user_id);
        jwt.verify(user_token, fetchUserToken.user_token);
        next();
    } catch (error) {
        res.status(200).json({invalidToken: `Token invalido`})
    }
}

module.exports = { authenticateToken };
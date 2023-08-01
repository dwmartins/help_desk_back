const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/user');
const bcrypt = require('bcrypt');

const userDB = new User;

async function createUser(req, res) {
    const { user_nome, user_sobrenome, user_email, user_password, user_tipo, user_ativo, user_foto } = req.body;
    const emailExists = await userDB.existingEmail(user_email);
    const token = newCrypto();

    if(!emailExists.length) {
        const password = await encodePassword(user_password);
        const user_date_create = new Date();
        const user =  await userDB.newUser(user_nome, user_sobrenome, user_email, password, token, user_ativo, user_date_create, user_foto);
        await userDB.addTypeUser(user_tipo, user.userID, user_date_create);
        if(user.success) {
            sendResponse(res, 200, user)
        } else {
            sendResponse(res, 500, user);
        }
    } else if(emailExists.length) {
        const response = {alert: `Este e-mail já está em uso.`};
        sendResponse(res, 200, response);
    } else {
        const response = {erro: emailExists.erro, msg: `Erro ao criar o usuário.`};
        sendResponse(res, 500, response);
    }
}

function newCrypto() {
    const secretKey = crypto.randomBytes(32).toString('hex');
    return secretKey;
}

async function encodePassword(password) {
    try {
        const hash = await bcrypt.hash(password, 10);
        return hash
    } catch (error) {
        return {erro: error, msg: `Erro ao codificar a senha.`}
    }
}

function sendResponse(res, statusCode, msg) {
    res.status(statusCode).json(msg);
}

module.exports = {
    createUser
}
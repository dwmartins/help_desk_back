const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const sendEmail = require('./sendEmail');

const userDB = new User;
const getDateTime = new Date();

async function createUser(req, res) {
    const { user_nome, user_sobrenome, user_email, user_password, user_tipo, user_ativo, user_foto } = req.body;
    const emailExists = await userDB.existingEmail(user_email);
    const token = newCrypto();

    if(!emailExists.length) {
        const password = await encodePassword(user_password);
        const user =  await userDB.newUser(user_nome, user_sobrenome, user_email, password, token, user_ativo, getDateTime, user_foto);
        if(user.success) {
            await userDB.addTypeUser(user_tipo, user.userID, getDateTime);
            sendEmail.welcome(user_email, user_nome);
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

async function updateUser(req, res) {
    const { user_nome, user_sobrenome, user_id } = req.body;
    
    const user = await userDB.updateUserDB(user_nome, user_sobrenome, getDateTime, user_id);

    if(user.success) {
        sendResponse(res, 200, user);
    } else if(user.erro){
        sendResponse(res, 500, user);
    }
}

async function updateUserType(req, res) {
    const { user_new_tipo, user_id } = req.body;
    const user = await userDB.updateUserTypeDB(user_new_tipo, getDateTime, user_id);

    if(user.success) {
        sendResponse(res, 200, user);
    } else if(user.erro){
        sendResponse(res, 500, user);
    }
}

async function getAllUsers(req, res) {
    const users = await userDB.allUsers();
    if(users.length) {
        sendResponse(res, 200, users);
    } else if(users.erro) {
        sendResponse(res, 500, users);
    }
}

async function newPassword(req, res) {
    const { user_email } = req.body;
    const user = await userDB.searchUserByEmail(user_email);

    if(user) {
        const code = generateAlphanumericCode(6);

        const saveCode = await userDB.saveCodePassword(user.user_id, code, getDateTime);

        if(saveCode) {
            sendEmail.newPassword(user.user_email, user.user_nome, code);
            const response = {success: true, user_id: user.user_id, msg: `Código de confirmação enviado no e-mail: ${user_email}`};
            sendResponse(res, 200, response);
        } else {
            const response = {erro: saveCode.erro, msg: `Erro ao enviar o código de confirmação, tente novamente.`};
            sendResponse(res, 500, response);
        }
    } else {
        sendResponse(res, 400, {alert: `Usuário não encontrado.`});
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

function generateAlphanumericCode(size) {
    let code = '';
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (let i = 0; i < size; i++) {
      const indice = Math.floor(Math.random() * caracteres.length);
      code += caracteres.charAt(indice);
    }
  
    return code;
}

function sendResponse(res, statusCode, msg) {
    res.status(statusCode).json(msg);
}

module.exports = {
    createUser,
    updateUser,
    updateUserType,
    getAllUsers,
    newPassword
}
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
            userDB.addTypeUser(user_tipo, user.userID, getDateTime);
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

async function comparePasswordCode(req, res) {
    const { user_id, code } = req.body;
    const data = await userDB.comparePasswordCodeDB(user_id, code);
    
    if(data) {
        if(data.codigo_usado) {
            const response = {alert: `Código de verificação já utilizado`};
            sendResponse(res, 200, response);
        } else {
            const response = {success: true, code_id: data.code_id, codigo: data.codigo, user_id: data.user_id, msg: `Código validado.`};
            sendResponse(res, 200, response)
        }
       
    } else {
        const response = {alert: `Código de verificação incorreto`};
        sendResponse(res, 200, response) 
    }
}

async function updatePassword(req, res) {
    const { user_id, new_password, code_id } = req.body;
    const password_hash = await encodePassword(new_password);

    if(password_hash) {
        const newPassword = await userDB.updatePasswordDB(user_id, password_hash);
        if(newPassword) {
            const response = {success: true, msg: `Senha alterada com sucesso.`};
            userDB.updatePasswordCodeDB(code_id);
            sendResponse(res, 200, response);
        } else {
            const response = {erro: newPassword.erro, msg: `Erro ao alterar a senha, tente novamente.`};
            sendResponse(res, 500, response);
        }
    } else {
        const response = {erro: password_hash.erro, msg: `Erro ao alterar a senha, tente novamente.`};
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
    newPassword,
    comparePasswordCode,
    updatePassword
}
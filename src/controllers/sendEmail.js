const Nodemailer = require('../models/nodeMailer');
const fs = require('fs');

const sendEmail = new Nodemailer();

function welcome(to, name) {

   fs.readFile('src/formatEmail/welcome.html', 'utf8', (err, data) => {
    if (err) {
        console.log(`error reading email sending html: ${err}`);
        return;
    }

    const modifiedEmail = data.replace('$userName', name);
    const subject = "Bem vindo ao Help Desk"

    sendEmail.sendEmail(to, subject, modifiedEmail);
   });
};

function newPassword(to, name, code) {
    fs.readFile('src/formatEmail/newPassword.html', 'utf8', (err, data) => {
        if (err) {
            console.log(`Error reading password resetting HTML file:${err}`);
            return;
        }

        const modifiedEmail = data.replace('$userName', name)
                            .replace('$verificationCode', code)
    
        const subject = "Alteração de Senha";

        sendEmail.sendEmail(to, subject, modifiedEmail);
    }) 
}

module.exports = { welcome, newPassword};
const DataBase = require('../../config/db');

class User {

    db;
    sql;

    constructor() {
        this.db = new DataBase;
    }

    async newUser(user_nome, user_sobrenome, user_email, user_password, user_token, user_ativo, user_create, user_foto) {
        try {
            this.sql = `INSERT INTO users (user_nome, user_sobrenome, user_email, user_password, user_token, user_ativo, user_create, user_foto )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?);`
            const values = [
                user_nome,
                user_sobrenome,
                user_email,
                user_password,
                user_token,
                user_ativo,
                user_create,
                user_foto
            ];

            await this.db.pool.query(this.sql, values);

            return {success: true, msg: `Usuário(a) criado com sucesso.`};
        } catch (error) {
            console.log(error)
            return {erro: error, msg: `Erro ao criar o usuário.`};
        }
    }

    async existingEmail(user_email) {
        try {
            const result = await this.db.pool.query(`SELECT user_email FROM users WHERE user_email = '${user_email}'`);
            return result[0];
        } catch (error) {
            return {erro: error, msg: `Erro ao verificar se o e-mail é existente.`}
        }
    }
}

module.exports = User;
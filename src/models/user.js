const DataBase = require('../../config/db');

class user {

    db;
    sql;

    constructor() {
        this.db = new DataBase;
    }

    async newUser(user_nome, user_sobrenome, user_email, user_password, user_token, user_ativo, user_date_create, user_date_desable, user_date_update, user_foto) {
        try {
            this.sql = `INSERT INTO users (user_nome, user_sobrenome, user_email, user_password, user_token, user_ativo, user_date_create, user_date_desable, user_date_update, user_foto )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`
            const values = [
                user_nome,
                user_sobrenome,
                user_email,
                user_password,
                user_token,
                user_ativo,
                user_date_create,
                user_date_desable,
                user_date_update,
                user_foto
            ];

            await this.db.pool.query(sql, values);

            return {success: true, msg: `Usuário(a) criado com sucesso.`, userData: data,};
        } catch (error) {
            return {erro: error, msg: `Erro ao criar o usuário.`};
        }
    }
}

module.exports = user;
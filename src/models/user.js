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

            const data = await this.db.pool.query(this.sql, values);

            return {success: true, msg: `Usuário(a) criado com sucesso.`, userID: data[0].insertId};
        } catch (error) {
            return {erro: error, msg: `Erro ao criar o usuário.`};
        }
    }

    async addTypeUser(user_tipo, user_id, data_create) {
        try {
            this.sql = `INSERT INTO user_tipo (user_tipo, user_id, tipo_create) VALUES (?, ?, ?);`;
            const values = [user_tipo, user_id, data_create];

            await this.db.pool.query(this.sql, values);

            return true;
        } catch (error) {
            return {erro: error, msg: `Erro ao salvar o tipo de usuário.`};
        }
    }

    async updateUserDB(user_nome, user_sobrenome, user_update, user_id) {
        try {
            this.sql = `UPDATE users
                        SET user_nome = ?,
                            user_sobrenome = ?,
                            user_update = ?
                        WHERE user_id = ?`;

            const values = [user_nome, user_sobrenome, user_update, user_id]
            await this.db.pool.query(this.sql, values);

            return {success: true, msg: `Usuário atualizado com sucesso.`}
        } catch (error) {
            return {erro: error, msg: `Erro ao atualizar o usuário`}
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

    async updateUserTypeDB(user_tipo, tipe_update, user_id) {
        try {
            this.sql = `UPDATE user_tipo
                        SET user_tipo = ?,
                            tipo_update = ?
                        WHERE user_id = ?`;

            const values = [user_tipo, tipe_update, user_id];
            await this.db.pool.query(this.sql, values);

            return {success: true, msg: `Tipo de usuário atualizado com sucesso.`}
        } catch (error) {
            return {erro: error, msg: `Erro ao atualizar o tipo do usuário`}
        }
    }
}

module.exports = User;
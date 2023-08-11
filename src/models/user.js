const DataBase = require('../../config/db');

class User {

    db;
    sql;
    all_user_Data;
    userByEmail;

    constructor() {
        this.db = new DataBase;
    }

    async newUser(user_nome, user_sobrenome, user_email, user_password, user_token, user_ativo, user_create, user_foto) {
        try {
            this.sql = `INSERT INTO users (user_nome, user_sobrenome, user_email, user_password, user_token, user_ativo, createdAt, user_foto )
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

            return {success: true, msg: `Usuário criado com sucesso.`, userID: data[0].insertId};
        } catch (error) {
            return {erro: error, msg: `Erro ao criar o usuário.`};
        }
    }

    async addTypeUser(user_tipo, user_id, data_create) {
        try {
            this.sql = `INSERT INTO user_tipo (user_tipo, user_id, createdAt) VALUES (?, ?, ?);`;
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
                            updateAt = ?
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
                            updateAt = ?
                        WHERE user_id = ?`;

            const values = [user_tipo, tipe_update, user_id];
            await this.db.pool.query(this.sql, values);

            return {success: true, msg: `Tipo de usuário atualizado com sucesso.`}
        } catch (error) {
            return {erro: error, msg: `Erro ao atualizar o tipo do usuário`}
        }
    }

    async allUsers() {
        try {
            this.all_user_Data = await this.db.pool.query(`
                SELECT *
                    FROM users
                        INNER JOIN user_tipo ON user_tipo.user_id = users.user_id
                    WHERE users.user_ativo = 'S'
            `);

            return this.all_user_Data[0];
        } catch (error) {
            return {erro: error, msg: `Erro ao buscar os usuários.`}
        }
    }

    async searchUserByEmail(user_email) {
        try {
            this.userByEmail = await this.db.pool.query(`
                SELECT *  
                FROM users
                INNER JOIN user_tipo ON users.user_id = user_tipo.user_id
                WHERE user_ativo = 'S'
                AND user_email = '${user_email}'
            ;`);

            return this.userByEmail[0][0];
        } catch (error) {
            return {erro: error, msg: `Erro ao buscar o e-mail.`}
        }
    }

    async saveCodePassword(user_id, user_codigo, requested_date) {
        try {
            this.sql = `INSERT INTO codigo_senha (user_id, codigo, createdAt) VALUES (?,?,?);`;
            const values = [user_id, user_codigo, requested_date];

            await this.db.pool.query(this.sql, values);
            return true;
        } catch (error) {
            return {erro: error, msg: `Erro ao salvar o código de nova senha.`}
        }
    }

    async comparePasswordCodeDB(user_id, code) {
        try {
            const result = await this.db.pool.query(`
                SELECT * 
                FROM codigo_senha
                WHERE user_id = '${user_id}'
                AND codigo = '${code}';
            `)

            return result[0][0];
        } catch (error) {
            return {erro: error, msg: `Erro ao buscar o código de alteração de senha.`}
        }
    }

    async updatePasswordDB(user_id, password_hash) {
        try {
            this.sql = `UPDATE users
                            SET user_password = ?
                            WHERE user_id = ?`;
            const values = [password_hash, user_id];

            await this.db.pool.query(this.sql, values);
            return true;
        } catch (error) {
            return {erro: error, msg: `Erro ao salvar a nova senha, tente novamente.`}
        }
    }

    async updatePasswordCodeDB(code_id, data_utilizado) {
        try {
            this.sql = `UPDATE codigo_senha
                            SET codigo_usado = ?,
                                updateAt = ?
                            WHERE codigo_id = ?
            `;
            const values = ['S', data_utilizado, code_id];
            await this.db.pool.query(this.sql, values);
            return true;
        } catch (error) {
            return {erro: error, msg: `Erro ao atualizar o código de nova senha.`}
        }
    }

    async userAccess(user_id, user_email, user_ip, user_acesso_date) {
        try {
            this.sql = `INSERT INTO user_acesso (user_id, user_email, user_ip, createdAt) VALUES (?, ?, ?, ?)`;
            const values = [user_id, user_email, user_ip, user_acesso_date];

           const result = await this.db.pool.query(this.sql, values);
            return result;
        } catch (error) {
            return {erro: error, msg: `Erro ao salvar o acesso do usuário.`}
        }
    }

    async disableUserDB(user_id, action, date_desable) {
        try {
            this.sql = `UPDATE users SET user_ativo = ?, user_disable = ? WHERE user_id = ?`;
            const values = [action, date_desable, user_id];

            this.db.pool.query(this.sql, values);
            return true;
        } catch (error) {
            return {erro: error}
        }
    }

    async fetchUserToken(user_id) {
        try {
            this.sql = `SELECT user_token FROM users WHERE user_id = ?`;
            const values = [user_id];

            const result = await this.db.pool.query(this.sql, values);
            return result[0][0];
        } catch (error) {
            return {erro: error, msg: `Erro ao buscar o validar o token.`};
        }
    }
}

module.exports = User;
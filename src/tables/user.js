const Database = require('../../config/db');
const db = new Database;

class NewTableUser {

    async tablesUser() {
        try {
            await db.pool.query(`
                CREATE TABLE IF NOT EXISTS users (
                    user_id INT AUTO_INCREMENT PRIMARY KEY,
                    user_nome VARCHAR(100) NOT NULL,
                    user_sobrenome VARCHAR(100) NOT NULL,
                    user_email VARCHAR(100) NOT NULL UNIQUE,
                    user_password VARCHAR(255) NOT NULL,
                    user_token VARCHAR(255) NOT NULL,
                    user_ativo VARCHAR(1),
                    createdAt DATETIME,
                    user_disable DATETIME,
                    updateAt DATETIME,
                    user_foto VARCHAR(255));`
                );
        } catch (error) {
            console.log(`Erro ao criar a tabela de ( Usuários ): ${error}`)
        }
    }

    async tableUserType() {
        try {
            await db.pool.query(`
                CREATE TABLE IF NOT EXISTS user_tipo (
                    tipo_id INT AUTO_INCREMENT PRIMARY KEY,
                    user_tipo VARCHAR(255),
                    user_id INT NOT NULL,
                    createdAt DATETIME,
                    updateAt DATETIME,
                    FOREIGN KEY (user_id) REFERENCES users(user_id)
                );`
            );
        } catch (error) {
            console.log(`Erro ao criar a tabela de ( user_tipo ): ${error}`)
        }
    }

    async tableUserAcesso() {
        try {
            await db.pool.query(`
                CREATE TABLE IF NOT EXISTS user_acesso (
                    acesso_id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id INT NOT NULL,
                    user_email VARCHAR(100) NOT NULL,
                    user_ip VARCHAR(255) NOT NULL,
                    createdAt DATETIME,
                    FOREIGN KEY (user_id) REFERENCES users(user_id)
                );`
            );
        } catch (error) {
            console.log(`Erro ao criar a tabela de ( user_acesso ): ${error}`);
        }
    }

    async tableNewPassword() {
        try {
            await db.pool.query(`
                CREATE TABLE IF NOT EXISTS codigo_senha (
                    codigo_id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id INT NOT NULL,
                    codigo VARCHAR(100) NOT NULL,
                    codigo_usado VARCHAR(1),
                    createdAt DATETIME NOT NULL,
                    updateAt DATETIME NOT NULL,
                    FOREIGN KEY (user_id) REFERENCES users(user_id)
                );`
            );
        } catch (error) {
            console.log(`Erro ao criar a tabela de ( codigo_senha ): ${error}`);
        }
    }

    // Cria as tabelas em ordem para não houver erro de chaves estrangeras por não existir as tabelas;
    async createAll() {
        await this.tablesUser();
        await this.tableUserType();
        await this.tableUserAcesso();
        await this.tableNewPassword();
    }
}

const table = new NewTableUser;
table.createAll();

module.exports = NewTableUser;
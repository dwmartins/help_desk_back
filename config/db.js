const mysql = require('mysql2/promise');
require('dotenv').config();
const getDateTime = require('../src/utilities/getDateTime')

class Database {
    
    pool;
    
    constructor() {
        this.pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
        });
    }
    
    async connect() {
        console.log(`Inciando conexão com o banco de dados: ${getDateTime.getDateTime()}`)
        try {
            // Testando a conexão
            await this.pool.query('SELECT 1+1');
            
            console.log(`Conexão com o banco de dados estabelecida com sucesso: ${getDateTime.getDateTime()}`);
            
            const configTables = require('./configTables');
            configTables.createAll();
            return this.pool;
        } catch (error) {
            console.error('Erro ao conectar ao banco de dados:', error.message);
            console.error(`slq error status: ${error.sqlState}`);
        }
    }

}

const conn = new Database;
conn.connect();

module.exports = Database;
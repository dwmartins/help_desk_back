require('dotenv').config();
const express = require("express");
const cors = require('cors');
const app = express();
const port = process.env.SERVER_PORT;
require('./config/db');
require('./src/tables/user');
const userRoutes = require('./src/routes/userRoutes');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).send(`<h2>running server!</h2>`)
});

app.use('/', userRoutes);

app.use((req, res, next) => {
    const erro = new Error('route not found');
    erro.status = 404;
    next(erro);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.json({
        erro: {
            erro: error.message
        }
    });
});
 
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
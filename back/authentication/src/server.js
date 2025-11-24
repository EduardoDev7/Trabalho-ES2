const express = require('express');
const cors = require('cors');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../patient/register.env') });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rotas
const registerRoute = require('./routes/register');
app.use('/register', registerRoute);

const loginRoute = require('./routes/login');
app.use('/login', loginRoute);

// Porta
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

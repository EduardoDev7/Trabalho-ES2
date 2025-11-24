const express = require('express');
const cors = require('cors');

const registerRoute = require('./routes/register');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/register', registerRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

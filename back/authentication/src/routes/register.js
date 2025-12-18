//register.js
const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');

const router = express.Router();

router.post('/', (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }

  // Verifica se já existe
  const user = db.prepare('SELECT * FROM patient WHERE email = ?').get(email);
  if (user) {
    return res.status(409).json({ error: 'Usuário já cadastrado.' });
  }

  // Criptografa a senha
  const hashed = bcrypt.hashSync(password, 10);

  // Salva no banco
  const stmt = db.prepare(`
    INSERT INTO patient (email, password, name)
    VALUES (?, ?, ?)
  `);

  stmt.run(email, hashed, name);

  return res.status(201).json({ message: 'Usuário registrado com sucesso.' });
});

module.exports = router;

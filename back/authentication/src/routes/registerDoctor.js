const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const router = express.Router();

router.post('/', (req, res) => {
    const { email, password, name, crm, especialidade } = req.body;

    // 1. Validação de campos obrigatórios
    if (!email || !password || !crm || !especialidade) {
        return res.status(400).json({ error: 'Todos os campos (email, senha, CRM e especialidade) são obrigatórios.' });
    }

    // 2. Verifica se o médico já existe (por email ou CRM)
    const existing = db.prepare('SELECT id FROM doctor WHERE email = ? OR crm = ?').get(email, crm);
    if (existing) {
        return res.status(409).json({ error: 'Médico já cadastrado com este e-mail ou CRM.' });
    }

    const hashed = bcrypt.hashSync(password, 10);

    try {
        const stmt = db.prepare(`
            INSERT INTO doctor (name, email, password, crm, especialidade)
            VALUES (?, ?, ?, ?, ?)
        `);
        stmt.run(name, email, hashed, crm, especialidade);
        return res.status(201).json({ message: 'Médico registrado com sucesso.' });
    } catch (err) {
        return res.status(500).json({ error: 'Erro ao salvar no banco de dados.' });
    }
});

module.exports = router;
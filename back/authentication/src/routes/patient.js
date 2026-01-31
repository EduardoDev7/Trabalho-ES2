const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const path = require('path');

// Importa o banco de dados (ajuste o caminho se necessário)
const db = require(path.resolve(__dirname, '..', 'db.js'));

// Middleware de Autenticação interno (para proteger as rotas da ficha)
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Token não fornecido.' });

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Token inválido.' });
    }
};

// --- ROTAS DA FICHA MÉDICA ---

// GET: Carrega dados da ficha para o formulário
router.get('/history', authMiddleware, (req, res) => {
    try {
        const patient = db.prepare(`
            SELECT diabetes_type, diagnosis_date, allergies, medications, notes 
            FROM patient 
            WHERE id = ?
        `).get(req.user.id);

        if (!patient) return res.status(404).json({ error: 'Paciente não encontrado.' });
        res.json(patient);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar ficha médica.' });
    }
});

// POST: Salva ou Atualiza dados da ficha
router.post('/history', authMiddleware, (req, res) => {
    const { diabetes_type, diagnosis_date, allergies, medications, notes } = req.body;
    try {
        const stmt = db.prepare(`
            UPDATE patient 
            SET diabetes_type = ?, diagnosis_date = ?, allergies = ?, medications = ?, notes = ?
            WHERE id = ?
        `);
        stmt.run(diabetes_type, diagnosis_date, allergies, medications, notes, req.user.id);
        res.json({ message: 'Ficha médica atualizada com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao salvar ficha médica.' });
    }
});

module.exports = router;
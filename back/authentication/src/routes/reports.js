const express = require('express');
const router = express.Router();
const ReportRepository = require('../../repositories/ReportRepository');
const jwt = require('jsonwebtoken');

// Middleware de Autenticação (mesmo que você já usa)
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) { res.status(401).json({ error: 'Não autorizado' }); }
};

router.get('/monthly', authMiddleware, async (req, res) => {
    const { month, year } = req.query;
    const patient_id = req.user.id;

    try {
        const data = await ReportRepository.getMonthlyStats(patient_id, month, year);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao gerar relatório' });
    }
});

module.exports = router;
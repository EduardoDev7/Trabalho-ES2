const express = require('express');
const router = express.Router();
const db = require('../db');
const path = require('path');
const fs = require('fs');

// Verifica caminho do middleware (mantendo sua lógica de verificação de pasta)
const mwPath = fs.existsSync(path.resolve(__dirname, '../middleware/authMiddleware.js')) 
    ? '../middleware/authMiddleware' 
    : '../middlewares/authMiddleware';
const authMiddleware = require(mwPath);

router.post('/schedule', authMiddleware, (req, res) => {
    const { doctor_id, date, time, reason } = req.body;
    const patient_id = req.user.id;

    if (!doctor_id || !date || !time) {
        return res.status(400).json({ error: 'Médico, Data e Hora são obrigatórios.' });
    }

    try {
        const stmt = db.prepare(`
            INSERT INTO consultation (patient_id, doctor_id, date, time, reason, status)
            VALUES (?, ?, ?, ?, ?, 'pending')
        `);
        const info = stmt.run(patient_id, doctor_id, date, time, reason || '');
        res.status(201).json({ id: info.lastInsertRowid, message: 'Agendamento solicitado!' });
    } catch (error) {
        console.error("Erro no Banco (Schedule):", error.message);
        res.status(500).json({ error: "Erro ao salvar agendamento." });
    }
});

router.get('/my-consultations', authMiddleware, (req, res) => {
    try {
        const consultations = db.prepare(`
            SELECT c.*, d.name AS doctor_name 
            FROM consultation c
            JOIN doctor d ON c.doctor_id = d.id
            WHERE c.patient_id = ?
            ORDER BY c.date DESC, c.time DESC
        `).all(req.user.id);
        res.json(consultations);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar suas consultas.' });
    }
});

router.get('/doctor', authMiddleware, (req, res) => {
    const doctorId = req.user.id; 
    
    try {
        const getByStatus = (status) => db.prepare(`
            SELECT 
                c.id, c.date, c.time, c.reason, c.meet_link, 
                c.patient_id, p.name AS patient_name
            FROM consultation c
            JOIN patient p ON c.patient_id = p.id
            WHERE c.doctor_id = ? AND c.status = ?
            ORDER BY c.date ASC, c.time ASC
        `).all(doctorId, status);

        res.json({ 
            pending: getByStatus('pending'), 
            confirmed: getByStatus('confirmed') 
        });
    } catch (error) {
        console.error("Erro no Painel Médico:", error.message);
        res.status(500).json({ error: 'Erro ao carregar painel.' });
    }
});


router.patch('/:id/status', authMiddleware, (req, res) => {
    const { status } = req.body;
    const { id } = req.params;
    const doctorId = req.user.id;

    try {
        const stmt = db.prepare("UPDATE consultation SET status = ? WHERE id = ? AND doctor_id = ?");
        const result = stmt.run(status, id, doctorId);
        
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Consulta não encontrada ou sem permissão.' });
        }
        res.json({ message: 'Status atualizado!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.patch('/:id/link', authMiddleware, (req, res) => {
    const { meet_link } = req.body;
    const { id } = req.params;
    const doctorId = req.user.id;

    try {
        const stmt = db.prepare("UPDATE consultation SET meet_link = ? WHERE id = ? AND doctor_id = ?");
        stmt.run(meet_link, id, doctorId);
        res.json({ message: 'Link adicionado com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/patient/:id/history', authMiddleware, (req, res) => {
    try {
        // Seleciona apenas campos de saúde, sem a senha
        const profile = db.prepare(`
            SELECT name, email, diabetes_type, diagnosis_date, allergies, medications, notes 
            FROM patient 
            WHERE id = ?
        `).get(req.params.id);
        
        res.json(profile || { error: "Perfil não encontrado." });
    } catch (error) { 
        res.status(500).json({ error: "Erro ao buscar prontuário." }); 
    }
});

module.exports = router;

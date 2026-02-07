const express = require('express');
const router = express.Router();
const db = require('../db');
const path = require('path');
const fs = require('fs');

// Verifica caminho do middleware
const mwPath = fs.existsSync(path.resolve(__dirname, '../middleware/authMiddleware.js')) 
    ? '../middleware/authMiddleware' 
    : '../middlewares/authMiddleware';
const authMiddleware = require(mwPath);

// AGENDAR CONSULTA
router.post('/schedule', authMiddleware, (req, res) => {
    const { doctor_id, date, reason } = req.body;
    const patient_id = req.user.id;

    try {
        const stmt = db.prepare(`
            INSERT INTO consultation (patient_id, doctor_id, date, reason, status)
            VALUES (?, ?, ?, ?, 'pending')
        `);
        const info = stmt.run(patient_id, doctor_id, date, reason);
        res.status(201).json({ id: info.lastInsertRowid, message: 'Sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PAINEL DO MÉDICO (ATUALIZADO PARA TRAZER O LINK)
router.get('/doctor', authMiddleware, (req, res) => {
    const doctorId = req.user.id; 
    
    try {
        const getByStatus = (status) => db.prepare(`
            SELECT 
                c.id, 
                c.date, 
                c.reason,
                c.notes, 
                c.meet_link, -- Agora retorna o link salvo
                c.patient_id, 
                p.name AS patient_name
            FROM consultation c
            JOIN patient p ON c.patient_id = p.id
            WHERE c.doctor_id = ? AND c.status = ?
            ORDER BY c.date ASC
        `).all(doctorId, status);

        const pending = getByStatus('pending');
        const confirmed = getByStatus('confirmed');

        res.json({ pending, confirmed });
    } catch (error) {
        console.error("Erro no SQL:", error.message);
        res.status(500).json({ error: 'Erro ao carregar consultas.' });
    }
});

// ATUALIZAR STATUS
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
        res.json({ message: 'Status atualizado com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// SALVAR LINK DO MEET (CORRIGIDO)
router.patch('/:id/link', authMiddleware, (req, res) => {
    const { meet_link } = req.body; // Recebe o link do frontend
    const { id } = req.params;      // ID da consulta
    const doctorId = req.user.id;   // ID do médico logado

    try {
        // Só permite atualizar se a consulta pertencer ao médico logado
        const stmt = db.prepare(`
            UPDATE consultation 
            SET meet_link = ? 
            WHERE id = ? AND doctor_id = ?
        `);
        const result = stmt.run(meet_link, id, doctorId);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Consulta não encontrada ou você não tem permissão para editá-la.' });
        }

        res.json({ message: 'Link do Meet salvo com sucesso!' });
    } catch (error) {
        console.error("Erro ao salvar link:", error.message);
        res.status(500).json({ error: 'Erro interno ao salvar o link.' });
    }
});

// PRONTUÁRIO
router.get('/patient/:id/history', authMiddleware, (req, res) => {
    try {
        const profile = db.prepare("SELECT * FROM patient_profiles WHERE patient_id = ?").get(req.params.id);
        res.json(profile || {});
    } catch (error) { 
        res.json({}); 
    }
});

module.exports = router;

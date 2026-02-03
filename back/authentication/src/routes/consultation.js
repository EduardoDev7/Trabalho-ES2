const express = require('express');
const router = express.Router();
const db = require('../db');
const path = require('path');
const fs = require('fs');

const mwPath = fs.existsSync(path.resolve(__dirname, '../middleware/authMiddleware.js')) 
    ? '../middleware/authMiddleware' 
    : '../middlewares/authMiddleware';

const authMiddleware = require(mwPath);

// 1. Agendar Consulta
router.post('/schedule', authMiddleware, (req, res) => {
    const { doctor_id, date, reason } = req.body;
    const patient_id = req.user.id;

    if (!doctor_id || !date) {
        return res.status(400).json({ error: 'Médico e Data são obrigatórios.' });
    }

    try {
        const stmt = db.prepare(`
            INSERT INTO consultation (patient_id, doctor_id, date, reason, status)
            VALUES (?, ?, ?, ?, 'pending')
        `);
        const info = stmt.run(patient_id, doctor_id, date, reason);
        
        res.status(201).json({ 
            id: info.lastInsertRowid, 
            message: 'Agendamento solicitado com sucesso!' 
        });
    } catch (error) {
        console.error("Erro ao agendar:", error.message);
        res.status(500).json({ error: 'Erro interno ao salvar agendamento.' });
    }
});

// 2. Listar Consultas do Paciente
router.get('/my-consultations', authMiddleware, (req, res) => {
    try {
        const consultations = db.prepare(`
            SELECT c.id, c.date, c.reason, c.notes, c.status, d.name as doctor_name 
            FROM consultation c
            JOIN doctor d ON c.doctor_id = d.id
            WHERE c.patient_id = ?
            ORDER BY c.date DESC
        `).all(req.user.id);

        res.json(consultations);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar consultas.' });
    }
});

// 3. Painel de Consultas (Pendentes e Confirmadas)
router.get('/doctor-panel', authMiddleware, (req, res) => {
    const doctorId = req.user.id;

    try {
        const query = (status) => db.prepare(`
            SELECT c.id, c.date, c.reason, c.meet_link, p.name as patient_name
            FROM consultation c
            JOIN patient p ON c.patient_id = p.id
            WHERE c.doctor_id = ? AND c.status = ?
        `).all(doctorId, status);

        res.json({ 
            pending: query('pending'), 
            confirmed: query('confirmed') 
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao carregar painel médico.' });
    }
});

// 4. Atualizar Status (Aceitar/Recusar) e Adicionar Link
router.patch('/:id/update', authMiddleware, (req, res) => {
    const { status, meet_link } = req.body;
    const { id } = req.params;

    try {
        if (status) {
            db.prepare("UPDATE consultation SET status = ? WHERE id = ?").run(status, id);
        }
        if (meet_link) {
            db.prepare("UPDATE consultation SET meet_link = ? WHERE id = ?").run(meet_link, id);
        }
        res.json({ message: 'Consulta atualizada com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar dados da consulta.' });
    }
});

module.exports = router;

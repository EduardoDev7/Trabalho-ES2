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

//AGENDAR CONSULTA

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

// PAINEL DO MÉDICO (CONSERTADO)
router.get('/doctor', authMiddleware, (req, res) => {
    const doctorId = req.user.id; 
    
    console.log("\n--- DEBUG PAINEL MÉDICO ---");
    console.log("ID do Médico no Token:", doctorId);

    try {
        const getByStatus = (status) => db.prepare(`
            SELECT 
                c.id, 
                c.date, 
                c.reason AS notes, 
                c.patient_id, 
                p.name AS patient_name
            FROM consultation c
            JOIN patient p ON c.patient_id = p.id
            WHERE c.doctor_id = ? AND c.status = ?
            ORDER BY c.date ASC
        `).all(doctorId, status);

        const pending = getByStatus('pending');
        const confirmed = getByStatus('confirmed');

        console.log(`Sucesso: Encontradas ${pending.length} pendentes para o ID ${doctorId}`);
        console.log("---------------------------\n");

        res.json({ pending, confirmed });
    } catch (error) {
        console.error("Erro no SQL:", error.message);
        res.status(500).json({ error: 'Erro ao carregar consultas.' });
    }
});

// ATUALIZAR STATUS (CORRIGIDO)
router.patch('/:id/status', authMiddleware, (req, res) => {
    const { status } = req.body;
    const { id } = req.params;
    const doctorId = req.user.id;

    console.log(`Tentando atualizar consulta ${id} para status ${status} (Médico: ${doctorId})`);

    try {
        const stmt = db.prepare("UPDATE consultation SET status = ? WHERE id = ? AND doctor_id = ?");
        const result = stmt.run(status, id, doctorId);

        if (result.changes === 0) {
            console.log("Nenhuma linha alterada. Verifique se o ID da consulta e o ID do médico batem.");
            return res.status(404).json({ error: 'Consulta não encontrada ou não pertence a este médico.' });
        }

        res.json({ message: 'Status atualizado com sucesso!' });
    } catch (error) {
        console.error("Erro ao atualizar status:", error.message);
        res.status(500).json({ error: error.message });
    }
});

router.patch('/:id/link', authMiddleware, (req, res) => {
    res.status(400).json({ error: 'A coluna meet_link não existe na tabela consultation.' });
});

//PRONTUÁRIO
router.get('/patient/:id/history', authMiddleware, (req, res) => {
    try {
        const profile = db.prepare("SELECT * FROM patient_profiles WHERE patient_id = ?").get(req.params.id);
        res.json(profile || {});
    } catch (error) { 
        console.log("Aviso: Tabela patient_profiles não encontrada.");
        res.json({}); 
    }
});

module.exports = router;

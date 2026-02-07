const express = require('express');
const router = express.Router();
const db = require('../db');
const path = require('path');
const fs = require('fs');

// Verifica caminho do middleware de autenticação
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

router.get('/my-consultations', authMiddleware, (req, res) => {
    try {
        const consultations = db.prepare(`
            SELECT 
                c.id, 
                c.date, 
                c.reason, 
                c.notes, 
                c.status, 
                c.meet_link, 
                d.name as doctor_name 
            FROM consultation c
            JOIN doctor d ON c.doctor_id = d.id
            WHERE c.patient_id = ?
            ORDER BY c.date DESC
        `).all(req.user.id);

        res.json(consultations);
    } catch (error) {
        console.error("Erro ao buscar consultas do paciente:", error.message);
        res.status(500).json({ error: 'Erro ao buscar consultas.' });
    }
});

// 3. Painel de Consultas (Médico vê quem é o paciente e o link atual)
router.get('/doctor-panel', authMiddleware, (req, res) => {
    const doctorId = req.user.id;

    try {
        const query = (status) => db.prepare(`
            SELECT 
                c.id, 
                c.date, 
                c.reason, 
                c.notes,
                c.meet_link, 
                p.name as patient_name,
                p.id as patient_id
            FROM consultation c
            JOIN patient p ON c.patient_id = p.id
            WHERE c.doctor_id = ? AND c.status = ?
            ORDER BY c.date ASC
        `).all(doctorId, status);

        res.json({ 
            pending: query('pending'), 
            confirmed: query('confirmed') 
        });
    } catch (error) {
        console.error("Erro no painel médico:", error.message);
        res.status(500).json({ error: 'Erro ao carregar painel médico.' });
    }
});

// 4. Atualizar Status e Adicionar Link 
router.patch('/:id/update', authMiddleware, (req, res) => {
    const { status, meet_link, notes } = req.body;
    const { id } = req.params;
    const doctorId = req.user.id;

    try {
        // Verifica se a consulta pertence ao médico que está tentando editar
        const check = db.prepare("SELECT id FROM consultation WHERE id = ? AND doctor_id = ?").get(id, doctorId);
        
        if (!check) {
            return res.status(403).json({ error: 'Acesso negado ou consulta não encontrada.' });
        }

        // Constrói o update dinamicamente conforme o que foi enviado
        if (status) {
            db.prepare("UPDATE consultation SET status = ? WHERE id = ?").run(status, id);
        }
        if (meet_link !== undefined) {
            db.prepare("UPDATE consultation SET meet_link = ? WHERE id = ?").run(meet_link, id);
        }
        if (notes) {
            db.prepare("UPDATE consultation SET notes = ? WHERE id = ?").run(notes, id);
        }

        res.json({ message: 'Consulta atualizada com sucesso!' });
    } catch (error) {
        console.error("Erro ao atualizar consulta:", error.message);
        res.status(500).json({ error: 'Erro ao atualizar dados da consulta.' });
    }
});

// 5. Histórico do Paciente (Prontuário)
router.get('/patient/:id/history', authMiddleware, (req, res) => {
    try {
        const profile = db.prepare("SELECT * FROM patient_profiles WHERE patient_id = ?").get(req.params.id);
        res.json(profile || { message: "Nenhum perfil encontrado para este paciente." });
    } catch (error) { 
        console.error("Erro ao buscar histórico:", error.message);
        res.status(500).json({ error: 'Erro ao buscar histórico do paciente.' });
    }
});

module.exports = router;

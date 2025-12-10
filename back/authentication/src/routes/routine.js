const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Repositórios
const MealRoutineRepository = require('../../repositories/MealRoutineRepository');
const ExerciseRoutineRepository = require('../../repositories/ExerciseRoutineRepository');

// Middleware de Autenticação
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next(); 
    } catch (err) {
        return res.status(403).json({ error: 'Token inválido ou expirado.' });
    }
};

router.use(authMiddleware);

// 1. LISTAR Rotinas do dia (GET)
router.get('/:type', async (req, res) => {
    const { type } = req.params;
    const { date } = req.query;
    const patient_id = req.user.id; 

    if (!date) return res.status(400).json({ error: 'A data (query param ?date=YYYY-MM-DD) é obrigatória.' });

    try {
        let routines;
        if (type === 'meal') {
            routines = MealRoutineRepository.getRoutinesWithDailyStatus(patient_id, date);
        } else if (type === 'exercise') {
            routines = ExerciseRoutineRepository.getRoutinesWithDailyStatus(patient_id, date);
        } else {
            return res.status(404).json({ error: 'Tipo inválido.' });
        }
        return res.json(routines);
    } catch (error) {
        console.error(`Erro ao buscar rotinas:`, error);
        return res.status(500).json({ error: 'Erro interno.' });
    }
});

// 2. [NOVO] CRIAR Rotina (POST) - Faltava isso!
router.post('/:type', (req, res) => {
    const { type } = req.params;
    const patient_id = req.user.id;

    try {
        let newId;
        if (type === 'meal') {
            const { description, carbs } = req.body;
            if (!description || !carbs) return res.status(400).json({ error: 'Dados incompletos.' });
            newId = MealRoutineRepository.createRoutine(patient_id, description, carbs);

        } else if (type === 'exercise') {
            // O front manda { type: "Corrida", duration: 30 }
            // O repositório espera (id, type, duration)
            const { type: exerciseType, duration } = req.body; 
            // Fallback: se o front mandar 'description', usamos como type
            const finalType = exerciseType || req.body.description;

            if (!finalType || !duration) return res.status(400).json({ error: 'Dados incompletos.' });
            newId = ExerciseRoutineRepository.createRoutine(patient_id, finalType, duration);
        } else {
            return res.status(404).json({ error: 'Tipo inválido.' });
        }
        return res.status(201).json({ message: 'Criado com sucesso!', id: newId });
    } catch (error) {
        console.error(`Erro ao criar:`, error);
        return res.status(500).json({ error: 'Erro interno.' });
    }
});

// 3. MARCAR COMO FEITO (POST .../done)
router.post('/:type/:routineId/done', (req, res) => {
    const { type, routineId } = req.params;
    const { completion_date } = req.body;
    const patient_id = req.user.id; 

    if (!completion_date) return res.status(400).json({ error: 'Data obrigatória.' });

    try {
        let changes = 0;
        if (type === 'meal') changes = MealRoutineRepository.markRoutineAsDone(routineId, patient_id, completion_date);
        else if (type === 'exercise') changes = ExerciseRoutineRepository.markRoutineAsDone(routineId, patient_id, completion_date);
        
        if (changes > 0) return res.status(201).json({ message: 'Concluído.' });
        else return res.status(200).json({ message: 'Já estava concluído.' });
    } catch (error) {
        return res.status(500).json({ error: 'Erro interno.' });
    }
});

// 4. DESMARCAR (DELETE .../done)
router.delete('/:type/:routineId/done', (req, res) => {
    const { type, routineId } = req.params;
    const { completion_date } = req.body; 

    if (!completion_date) return res.status(400).json({ error: 'Data obrigatória.' });

    try {
        let changes = 0;
        if (type === 'meal') changes = MealRoutineRepository.unmarkRoutineAsDone(routineId, completion_date);
        else if (type === 'exercise') changes = ExerciseRoutineRepository.unmarkRoutineAsDone(routineId, completion_date);

        if (changes > 0) return res.status(200).json({ message: 'Desmarcado.' });
        else return res.status(404).json({ error: 'Não encontrado.' });
    } catch (error) {
        return res.status(500).json({ error: 'Erro interno.' });
    }
});

module.exports = router;
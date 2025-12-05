// [src/routes/routine.js]

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Repositórios de Rotinas
const MealRoutineRepository = require('../../repositories/MealRoutineRepository');
const ExerciseRoutineRepository = require('../../repositories/ExerciseRoutineRepository');

const authMiddleware = (req, res, next) => {
    // 1. Pega o token do header Authorization: Bearer <token>
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // 2. Verifica e decodifica o token usando a mesma chave secreta do login.js
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 3. Anexa os dados do usuário (id e email) à requisição
        req.user = decoded; 
        
        next(); // Continua para a próxima função (o handler da rota)
    } catch (err) {
        // 4. Se o token for inválido, expirado, etc.
        return res.status(403).json({ error: 'Token inválido ou expirado.' });
    }
};

// Aplica o middleware de autenticação a todas as rotas abaixo
router.use(authMiddleware);

// Retorna as rotinas do paciente E se ele as concluiu hoje (is_done)
router.get('/:type', async (req, res) => {
    const { type } = req.params;
    const { date } = req.query;
    const patient_id = req.user.id; // ID extraído do token pelo authMiddleware

    if (!date) {
        return res.status(400).json({ error: 'A data (query param ?date=YYYY-MM-DD) é obrigatória.' });
    }

    try {
        let routines;
        if (type === 'meal') {
            routines = MealRoutineRepository.getRoutinesWithDailyStatus(patient_id, date);
        } else if (type === 'exercise') {
            routines = ExerciseRoutineRepository.getRoutinesWithDailyStatus(patient_id, date);
        } else {
            return res.status(404).json({ error: 'Tipo de rotina inválido. Use "meal" ou "exercise".' });
        }

        return res.json(routines);
    } catch (error) {
        console.error(`Erro ao buscar rotinas de ${type}:`, error);
        return res.status(500).json({ error: 'Erro interno ao carregar rotinas.' });
    }
});

// Marca a conclusão diária da rotina.
router.post('/:type/:routineId/done', (req, res) => {
    const { type, routineId } = req.params;
    const { completion_date } = req.body;
    const patient_id = req.user.id; 

    if (!completion_date) {
        return res.status(400).json({ error: 'A completion_date é obrigatória.' });
    }

    try {
        let changes = 0;
        if (type === 'meal') {
            // Garante que o patient_id está ligado à rotina (segurança) e registra a conclusão
            changes = MealRoutineRepository.markRoutineAsDone(routineId, patient_id, completion_date);
        } else if (type === 'exercise') {
            changes = ExerciseRoutineRepository.markRoutineAsDone(routineId, patient_id, completion_date);
        } else {
            return res.status(404).json({ error: 'Tipo de rotina inválido.' });
        }

        if (changes > 0) {
            return res.status(201).json({ message: 'Rotina marcada como concluída.' });
        } else {
            return res.status(200).json({ message: 'Rotina já estava concluída nesta data.' });
        }
    } catch (error) {
        console.error(`Erro ao marcar rotina de ${type}:`, error);
        return res.status(500).json({ error: 'Erro interno ao marcar rotina como concluída.' });
    }
});


// Remove o registro de conclusão diária.
router.delete('/:type/:routineId/done', (req, res) => {
    const { type, routineId } = req.params;
    const { completion_date } = req.body; 

    if (!completion_date) {
        return res.status(400).json({ error: 'A completion_date é obrigatória no body para desmarcar.' });
    }

    try {
        let changes = 0;
        if (type === 'meal') {
            changes = MealRoutineRepository.unmarkRoutineAsDone(routineId, completion_date);
        } else if (type === 'exercise') {
            changes = ExerciseRoutineRepository.unmarkRoutineAsDone(routineId, completion_date);
        } else {
            return res.status(404).json({ error: 'Tipo de rotina inválido.' });
        }

        if (changes > 0) {
            return res.status(200).json({ message: 'Rotina desmarcada com sucesso.' });
        } else {
            return res.status(404).json({ error: 'Registro de conclusão não encontrado para esta data.' });
        }
    } catch (error) {
        console.error(`Erro ao desmarcar rotina de ${type}:`, error);
        return res.status(500).json({ error: 'Erro interno ao desmarcar rotina.' });
    }
});

module.exports = router;
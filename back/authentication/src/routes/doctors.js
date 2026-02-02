
const express = require('express');
const router = express.Router();
const db = require('../db'); 

// Rota GET para listar médicos
// Aqui usamos '/' porque no server.js já vamos definir que essa rota responde por '/doctors'
router.get('/', (req, res) => {
    try {
        console.log("Recebida solicitação na rota de médicos");
        
        const query = `SELECT id, name, crm, especialidade FROM doctor`;
        const doctors = db.prepare(query).all();
        
        console.log("Médicos encontrados:", doctors.length);
        res.json(doctors);
    } catch (error) {
        console.error("Erro ao buscar médicos:", error);
        res.status(500).json({ error: "Erro interno no servidor" });
    }
});

module.exports = router;

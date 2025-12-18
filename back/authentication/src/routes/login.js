const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post('/', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email e senha são obrigatórios." });
    }

    let user = null;
    let role = null;

    // 1. Tenta buscar como Paciente
    user = db.prepare("SELECT * FROM patient WHERE email = ?").get(email);
    if (user) {
        role = 'patient';
    } else {
        // 2. Se não achou, tenta buscar como Médico
        user = db.prepare("SELECT * FROM doctor WHERE email = ?").get(email);
        if (user) {
            role = 'doctor';
        }
    }

    // 3. Verifica se o usuário (qualquer um) existe
    if (!user) {
        return res.status(401).json({ error: "Credenciais inválidas." });
    }

    // 4. Compara senha
    const passwordCorrect = bcrypt.compareSync(password, user.password);
    if (!passwordCorrect) {
        return res.status(401).json({ error: "Credenciais inválidas." });
    }

    // 5. Gera token incluindo o 'role' (papel do usuário)
    const token = jwt.sign(
        { id: user.id, email: user.email, role: role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return res.json({
        message: "Login bem-sucedido!",
        name: user.name,
        role: role, 
        token
    });
});

module.exports = router;
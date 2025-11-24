const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.post('/', (req, res) => {
    const { email, password } = req.body;

    // 1. Validação básica
    if (!email || !password) {
        return res.status(400).json({ error: "Email e senha são obrigatórios." });
    }

    // 2. Busca o usuário no banco
    const stmt = db.prepare("SELECT * FROM patient WHERE email = ?");
    const user = stmt.get(email);

    if (!user) {
        return res.status(401).json({ error: "Credenciais inválidas." });
    }

    // 3. Compara senha
    const passwordCorrect = bcrypt.compareSync(password, user.password);

    if (!passwordCorrect) {
        return res.status(401).json({ error: "Credenciais inválidas." });
    }

    // 4. Gera token
    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return res.json({
        message: "Login bem-sucedido!",
        name: user.name,
        token
    });
});

module.exports = router;

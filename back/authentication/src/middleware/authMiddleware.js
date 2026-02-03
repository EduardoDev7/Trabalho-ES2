const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Acesso negado. Faça login.' });
    }

    try {
        // Usa a chave secreta do seu .env ou uma padrão
        const secret = process.env.JWT_SECRET || 'sua_chave_secreta_aqui';
        const decoded = jwt.verify(token, secret);
        req.user = decoded; // Aqui ele salva o ID do paciente logado
        next();
    } catch (err) {
        res.status(403).json({ error: 'Token inválido ou expirado.' });
    }
};

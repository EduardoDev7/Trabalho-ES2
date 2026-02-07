const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    // Verifica se o cabeçalho existe e se começa com "Bearer "
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.error("ERRO AUTH: Cabeçalho Authorization ausente ou fora do formato Bearer");
        return res.status(401).json({ error: 'Acesso negado. Faça login novamente.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // IMPORTANTE: Esta chave DEVE ser igual à do seu arquivo de login
        const secret = process.env.JWT_SECRET || 'sua_chave_secreta_aqui';
        
        const decoded = jwt.verify(token, secret);
        
        // Salva os dados no req.user para serem usados nas rotas
        req.user = decoded; 
        
        next();
    } catch (err) {
        // Exibe no terminal do servidor o motivo exato da falha
        if (err.name === 'TokenExpiredError') {
            console.error("ERRO AUTH: O token expirou em " + err.expiredAt);
        } else if (err.name === 'JsonWebTokenError') {
            console.error("ERRO AUTH: Assinatura inválida (Chave secreta pode estar diferente)");
        } else {
            console.error("ERRO AUTH:", err.message);
        }

        return res.status(403).json({ error: 'Sessão inválida ou expirada. Por favor, entre novamente.' });
    }
};

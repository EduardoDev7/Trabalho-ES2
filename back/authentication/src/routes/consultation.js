router.post('/schedule', authMiddleware, (req, res) => {
    const { doctor_id, date, reason } = req.body;
    const patient_id = req.user.id;

    console.log("--- TENTATIVA DE AGENDAMENTO ---");
    console.log("Paciente ID (do token):", patient_id);
    console.log("Médico ID (do form):", doctor_id);
    console.log("Data:", date);
    console.log("Motivo:", reason);
    // ----------------------

    if (!doctor_id || !date) {
        return res.status(400).json({ error: 'Médico e Data são obrigatórios.' });
    }

    try {
        const stmt = db.prepare(`
            INSERT INTO consultation (patient_id, doctor_id, date, reason, status)
            VALUES (?, ?, ?, ?, 'pending')
        `);

        const info = stmt.run(patient_id, doctor_id, date, reason);

        console.log("Sucesso! ID da consulta:", info.lastInsertRowid); 

        res.status(201).json({ 
            message: 'Consulta agendada com sucesso!', 
            consultationId: info.lastInsertRowid 
        });

    } catch (error) {
        // AQUI ESTÁ A CHAVE: Vamos ver o erro real no terminal
        console.error("ERRO SQL REAL:", error.message); 
        
        // Vamos mandar o erro real para o alerta do navegador também
        res.status(500).json({ error: "Erro no Banco: " + error.message });
    }
});

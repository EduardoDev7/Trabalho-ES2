const express = require('express');
const cors = require('cors');
const path = require('path');

// Ajuste para garantir que o dotenv pegue o caminho certo no Mac/Linux/Windows
require('dotenv').config({ path: path.resolve(__dirname, '../patient/register.env') });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- ROTAS ---

// 1. Rota de Paciente (já existia)
const registerRoute = require('./routes/register');
app.use('/register', registerRoute); 
// OBS: Essa rota responde em POST /register (para pacientes)

// 2. [NOVO] Rota de Médico 
// Importa o arquivo registerDoctor.js que você já criou
const registerDoctorRoute = require('./routes/registerDoctor');
// Define que tudo que chegar em /register/doctor vai para esse arquivo
app.use('/register/doctor', registerDoctorRoute);

// 3. Login
const loginRoute = require('./routes/login');
app.use('/login', loginRoute);

// 4. Rotinas (Dashboard)
const routineRoute = require('./routes/routine');
app.use('/api/routines', routineRoute);

const reportRoutes = require('./routes/reports');
app.use('/reports', reportRoutes);

const patientRoutes = require('./routes/patient');
app.use('/patient', patientRoutes);

// Porta
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
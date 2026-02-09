const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");

const dbPath = path.resolve(__dirname, 'diabetes.db');

// cria pasta se não existir
if (!fs.existsSync(path.dirname(dbPath))) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
}

// abre / cria banco
const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// cria todas as tabelas do sistema
db.exec(`

CREATE TABLE IF NOT EXISTS patient (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  name TEXT,
  diabetes_type TEXT, diagnosis_date TEXT, allergies TEXT, medications TEXT, notes TEXT
);

CREATE TABLE IF NOT EXISTS doctor (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  crm TEXT UNIQUE NOT NULL,
  especialidade TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS consultation (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  doctor_id INTEGER NOT NULL,
  date TEXT NOT NULL,
  reason TEXT,                    
  status TEXT DEFAULT 'pending',  
  notes TEXT, 
  meet_link TEXT, 
  FOREIGN KEY (patient_id) REFERENCES patient(id),
  FOREIGN KEY (doctor_id) REFERENCES doctor(id)
);


CREATE TABLE IF NOT EXISTS gamification_points (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  points INTEGER DEFAULT 0,
  FOREIGN KEY (patient_id) REFERENCES patient(id)
);

CREATE TABLE IF NOT EXISTS challenge (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  points_reward INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS patient_challenge (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  challenge_id INTEGER NOT NULL,
  completed INTEGER DEFAULT 0,
  FOREIGN KEY (patient_id) REFERENCES patient(id),
  FOREIGN KEY (challenge_id) REFERENCES challenge(id)
);

-- NOVAS TABELAS PARA ROTINAS DE REFEIÇÃO (Definição da Rotina)
CREATE TABLE IF NOT EXISTS patient_meal_routine (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  description TEXT NOT NULL, -- Ex: "Café da Manhã balanceado"
  carbs INTEGER, -- Meta de carboidratos
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patient(id) ON DELETE CASCADE
);

-- NOVAS TABELAS PARA O HISTÓRICO DE CONCLUSÃO (O check 'Done' diário)
CREATE TABLE IF NOT EXISTS meal_routine_completion (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  routine_id INTEGER NOT NULL,
  patient_id INTEGER NOT NULL,
  completion_date TEXT NOT NULL, -- Data no formato 'YYYY-MM-DD'
  UNIQUE (routine_id, completion_date), -- Garante um check por dia por rotina
  FOREIGN KEY (routine_id) REFERENCES patient_meal_routine(id) ON DELETE CASCADE,
  FOREIGN KEY (patient_id) REFERENCES patient(id) ON DELETE CASCADE
);

-- NOVAS TABELAS PARA ROTINAS DE EXERCÍCIO (Definição da Rotina)
CREATE TABLE IF NOT EXISTS patient_exercise_routine (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  type TEXT NOT NULL, -- Ex: "Caminhada"
  duration INTEGER NOT NULL, -- Duração em minutos
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patient(id) ON DELETE CASCADE
);

-- NOVAS TABELAS PARA O HISTÓRICO DE CONCLUSÃO (O check 'Done' diário)
CREATE TABLE IF NOT EXISTS exercise_routine_completion (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  routine_id INTEGER NOT NULL,
  patient_id INTEGER NOT NULL,
  completion_date TEXT NOT NULL, -- Data no formato 'YYYY-MM-DD'
  UNIQUE (routine_id, completion_date), -- Garante um check por dia por rotina
  FOREIGN KEY (routine_id) REFERENCES patient_exercise_routine(id) ON DELETE CASCADE,
  FOREIGN KEY (patient_id) REFERENCES patient(id) ON DELETE CASCADE
);
`);

console.log("Banco criado!");
db.close();

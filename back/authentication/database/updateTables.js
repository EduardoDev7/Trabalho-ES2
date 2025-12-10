const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "diabetes.db");
const db = new Database(dbPath);

console.log("Atualizando banco de dados em:", dbPath);

db.exec(`
  -- Tabela de Rotinas de Alimentação
  CREATE TABLE IF NOT EXISTS patient_meal_routine (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    description TEXT NOT NULL,
    carbs INTEGER NOT NULL,
    FOREIGN KEY (patient_id) REFERENCES patient(id)
  );

  -- Tabela de Rotinas de Exercício
  CREATE TABLE IF NOT EXISTS patient_exercise_routine (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    type TEXT NOT NULL,
    duration INTEGER NOT NULL,
    FOREIGN KEY (patient_id) REFERENCES patient(id)
  );

  -- Tabela de Conclusão Diária (Check) de Alimentação
  CREATE TABLE IF NOT EXISTS meal_routine_completion (
    routine_id INTEGER NOT NULL,
    patient_id INTEGER NOT NULL,
    completion_date TEXT NOT NULL,
    PRIMARY KEY (routine_id, completion_date),
    FOREIGN KEY (routine_id) REFERENCES patient_meal_routine(id),
    FOREIGN KEY (patient_id) REFERENCES patient(id)
  );

  -- Tabela de Conclusão Diária (Check) de Exercício
  CREATE TABLE IF NOT EXISTS exercise_routine_completion (
    routine_id INTEGER NOT NULL,
    patient_id INTEGER NOT NULL,
    completion_date TEXT NOT NULL,
    PRIMARY KEY (routine_id, completion_date),
    FOREIGN KEY (routine_id) REFERENCES patient_exercise_routine(id),
    FOREIGN KEY (patient_id) REFERENCES patient(id)
  );
`);

console.log("Tabelas de ROTINA criadas com sucesso!");
db.close();
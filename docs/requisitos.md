# Histórias de Usuário

## 1. [Alta] Agendar horário com médico
**Como Usuário**, quero agendar um horário com um dos médicos disponíveis para tirar dúvidas ou pedir ajuda.

**Critérios de Aceitação:**
* Deve ser possível visualizar a lista de médicos cadastrados.
* Deve ser possível visualizar os horários disponíveis de cada médico.
* O sistema deve impedir agendar horários já ocupados.
* Após confirmar o agendamento, ele deve ser salvo no banco de dados.
* O usuário deve receber uma confirmação visual do agendamento.

---

## 2. [Baixa] Converter pontos em benefícios
**Como Usuário**, quero conseguir mais pontos para convertê-los em descontos de empresas parceiras.

**Critérios de Aceitação:**
* O usuário deve visualizar sua pontuação atual.
* O sistema deve listar os itens/benefícios disponíveis para troca.
* Apenas itens compatíveis com a pontuação do usuário devem estar disponíveis para resgate.
* Após a troca, os pontos devem ser debitados corretamente.
* O sistema deve registrar a transação no histórico de recompensas.

---

## 3. [Alta] Salvar dados de saúde
**Como Usuário**, quero salvar dados sobre minha saúde (histórico médico, aferições diárias) para ganhar pontos e acompanhar meu estado de saúde.

**Critérios de Aceitação:**
* Deve existir um formulário para inserção de dados diários (glicemia, exercícios, alimentação etc.).
* Deve ser possível anexar comprovantes quando necessário.
* Cada registro concluído deve gerar pontuação conforme regras da gamificação.
* Os dados devem ser armazenados de forma segura e acessíveis no histórico do usuário.
* O usuário deve receber feedback visual ao salvar os dados.

---

## 4. [Média] Relatório mensal de desempenho
**Como Usuário**, quero receber um relatório mensal sobre meu desempenho para visualizar a evolução dos meus hábitos.

**Critérios de Aceitação:**
* O usuário deve visualizar o relatório mensal em formato gráfico ou textual.
* O relatório deve considerar todos os registros e pontos do mês.
* O usuário deve conseguir exportar ou visualizar o relatório na plataforma.
* O relatório deve ser gerado automaticamente para o mês atual.

---

## 5. [Média] Médico acessar histórico do paciente
**Como Médico**, quero acessar os históricos dos meus pacientes para personalizar o atendimento.

**Critérios de Aceitação:**
* O médico deve acessar apenas pacientes vinculados a ele ou que autorizaram o compartilhamento.
* O histórico deve exibir registros organizados por data.
* O sistema deve garantir a proteção de dados sensíveis.
* O médico deve conseguir visualizar o histórico antes de cada consulta.

---

## 6. [Alta] Médico analisar pedidos de agendamento
**Como Médico**, quero visualizar os requerimentos de agendamento para decidir se aceito atender o paciente.

**Critérios de Aceitação:**
* O médico deve visualizar uma lista de pedidos pendentes.
* Cada pedido deve mostrar nome do paciente, motivo e horário solicitado.
* O médico deve conseguir aceitar ou recusar a solicitação.
* O sistema deve notificar o paciente sobre a decisão.
* Agendamentos recusados devem liberar o horário novamente.

---

## 7. [Alta] Médico visualizar agenda
**Como Médico**, quero visualizar os agendamentos marcados para me preparar previamente.

**Critérios de Aceitação:**
* O médico deve visualizar uma agenda organizada por dia ou semana.
* Cada agendamento deve mostrar informações básicas do paciente.
* A agenda deve permitir filtro por data.
* Apenas agendamentos aceitos devem ser exibidos.

---

## 8. [Alta] Administrador validar médicos
**Como Administrador**, quero validar o cadastro de médicos antes da confirmação.

**Critérios de Aceitação:**
* O administrador deve visualizar médicos pendentes de aprovação.
* Deve ser possível aprovar ou rejeitar um cadastro.
* A aprovação libera o acesso do médico ao sistema.
* A rejeição deve notificar o usuário.
* Deve haver registro da decisão do administrador.

---

## 9. [Baixa] Administrador remover usuários
**Como Administrador**, quero remover um usuário do sistema.

**Critérios de Aceitação:**
* O administrador deve visualizar a lista de usuários cadastrados.
* Deve ser possível remover pacientes e médicos.
* A remoção deve impedir o login do usuário.
* O sistema deve solicitar confirmação antes da exclusão.
* Os dados associados devem seguir regras de segurança (arquivamento ou exclusão).

---

## 10. [Alta] Cadastro e login
**Como Usuário**, quero me cadastrar e fazer login para acessar o sistema.

**Critérios de Aceitação:**
* O sistema deve validar campos obrigatórios (email, senha, nome).
* A senha deve ser armazenada de forma segura (hash).
* O usuário deve conseguir recuperar a senha via e-mail.
* O login deve liberar acesso às áreas internas.
* Cadastros de médicos devem ficar pendentes até aprovação.

---

## 11. [Média] Tarefas diárias gamificadas
**Como Usuário**, quero visualizar e completar tarefas diárias gamificadas para ganhar pontos.

**Critérios de Aceitação:**
* O usuário deve visualizar as tarefas do dia.
* Ao concluir uma tarefa, deve receber pontos.
* As tarefas devem ser resetadas diariamente.
* O progresso deve aparecer no dashboard.

---

## 12. [Alta] Dashboard de evolução
**Como Usuário**, quero acessar um painel com gráficos e informações da minha evolução.

**Critérios de Aceitação:**
* O dashboard deve exibir pontuação, glicemia, tarefas concluídas etc.
* Deve ser atualizado automaticamente.
* Os gráficos devem ser fáceis de interpretar.
* Deve permitir filtros por semana e mês.

---

# Casos de Uso

## 1. Realizar cadastro e login
## 2. Agendar consulta com médico
## 3. Aprovar ou rejeitar agendamento
## 4. Registrar dados de saúde
## 5. Gerar relatório mensal
## 6. Gerenciar tarefas gamificadas
## 7. Resgatar benefícios com pontos
## 8. Visualizar histórico do paciente (médico)
## 9. Gerenciar agenda médica
## 10. Validar cadastro de médicos (admin)
## 11. Remover usuários do sistema (admin)
## 12. Visualizar dashboard de evolução


**Diagrama de Caso de Uso**
<img width="626" height="572" alt="Captura de Tela 2025-12-10 às 11 25 32" src="https://github.com/user-attachments/assets/327da682-5ea0-4f97-a17a-3a6c5df93b17" />




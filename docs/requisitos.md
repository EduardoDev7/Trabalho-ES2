**[Alta] Como Usuário, quero agendar um horário com um dos médicos disponíveis para tirar dúvidas ou pedir ajuda.**

**Critérios de Aceitação:**

Deve ser possível visualizar a lista de médicos cadastrados.

Deve ser possível visualizar os horários disponíveis de cada médico.

O sistema deve impedir agendar horários já ocupados.

Após confirmar o agendamento, ele deve ser salvo no banco de dados.

O usuário deve receber uma confirmação visual do agendamento.

**[Baixa] Como Usuário, quero conseguir mais pontos para convertê-los em descontos de empresas parceiras.**

**Critérios de Aceitação:**

O usuário deve visualizar sua pontuação atual.

O sistema deve listar os itens/benefícios disponíveis para troca.

Apenas itens compatíveis com a pontuação do usuário devem estar disponíveis para resgate.

Após a troca, os pontos devem ser debitados corretamente.

O sistema deve registrar a transação no histórico de recompensas.

**[Alta] Como Usuário, quero salvar dados sobre minha saúde (histórico médico, aferições diárias) para ganhar pontos e acompanhar meu estado de saúde.**

**Critérios de Aceitação:**

Deve existir um formulário para inserção de dados diários (glicemia, exercícios, alimentação, etc.).

Deve ser possível anexar comprovantes quando necessário.

Cada registro concluído deve gerar pontuação conforme regras da gamificação.

Os dados devem ser armazenados de forma segura e ficar acessíveis no histórico do usuário.

O usuário deve receber feedback visual ao salvar os dados.

**[Média] Como Usuário, quero receber um relatório mensal sobre meu desempenho para visualizar a evolução dos meus hábitos.**

**Critérios de Aceitação:**

O usuário deve visualizar o relatório mensal em formato gráfico ou textual.

O relatório deve considerar todos os registros e pontos do mês.

O usuário deve conseguir exportar ou visualizar o relatório diretamente na plataforma.

O relatório deve ser gerado automaticamente para o mês atual.

**[Média] Como Médico, quero acessar os históricos dos meus pacientes para personalizar o atendimento.**

**Critérios de Aceitação:**

O médico deve acessar apenas pacientes vinculados a ele ou que aceitaram compartilhar dados.

O histórico deve exibir registros de saúde organizados por data.

O sistema deve garantir que dados sensíveis estejam protegidos.

O médico deve conseguir visualizar o histórico antes de cada consulta.

**[Alta] Como Médico, quero visualizar os requerimentos de agendamento para decidir se aceito atender o paciente naquele horário.**

**Critérios de Aceitação:**

O médico deve visualizar uma lista com os pedidos pendentes.

Cada pedido deve mostrar: nome do paciente, motivo e horário solicitado.

O médico deve conseguir aceitar ou recusar a solicitação.

O sistema deve notificar o paciente sobre a decisão.

Agendamentos recusados devem liberar o horário novamente.

**[Alta] Como Médico, quero visualizar os agendamentos marcados para que eu possa me preparar previamente.**

**Critérios de Aceitação:**

O médico deve visualizar uma agenda organizada por dia ou semana.

Cada agendamento deve mostrar informações básicas do paciente.

A agenda deve permitir filtrar por data.

Os agendamentos aceitos devem ser exibidos automaticamente.

**[Alta] Como Administrador, quero validar o cadastro de médicos antes da confirmação para garantir que eles são adequados.**

**Critérios de Aceitação:**

O administrador deve visualizar médicos pendentes de aprovação.

Deve ser possível aprovar ou rejeitar um cadastro.

A aprovação libera o acesso do médico ao sistema.

A rejeição deve notificar o usuário e não criar permissões de médico.

Deve haver registro da decisão do administrador.

**[Baixa] Como Administrador, quero remover um usuário para que ele não faça mais parte da aplicação.**

**Critérios de Aceitação:**

O administrador deve visualizar a lista de usuários cadastrados.

Deve ser possível remover pelo menos pacientes e médicos.

A remoção deve impedir completamente o login do usuário removido.

O sistema deve solicitar confirmação antes de excluir.

Os dados associados devem ser tratados conforme regras de segurança (ex.: arquivamento ou exclusão).

**[Alta] Como Usuário, quero me cadastrar e fazer login para acessar as funcionalidades do sistema.**

**Critérios de Aceitação:**

O sistema deve validar campos obrigatórios (email, senha, nome etc.).

A senha deve ser armazenada de forma segura (hash).

O usuário deve conseguir recuperar senha via e-mail.

O login deve liberar acesso às áreas internas.

Se for médico, o cadastro deve ficar pendente até aprovação do administrador.

**[Média] Como Usuário, quero visualizar e completar minhas tarefas diárias gamificadas para manter minha constância e receber pontos.**

**Critérios de Aceitação:**

O usuário deve visualizar todas as tarefas disponíveis no dia.

Ao concluir uma tarefa, deve receber pontos.

As tarefas devem ser resetadas diariamente.

O progresso deve aparecer no dashboard do usuário.

**[Alta] Como Usuário, quero acessar um painel com gráficos e informações da minha evolução para acompanhar meu progresso.**

**Critérios de Aceitação:**

O dashboard deve exibir dados como pontuação, glicemia, tarefas concluídas, etc.

Deve ser atualizado automaticamente com os dados enviados.

Gráficos devem ser fáceis de interpretar.

Deve haver opção de filtrar por semana e mês.


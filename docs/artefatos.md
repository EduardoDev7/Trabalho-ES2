**Funcionalidades já entregues**

**SPRINT 1**
1 - Criar interface de login/cadastro 

Foi desenvolvida a primeira tela de interação do usuário com o sistema, contendo os formulários de login e registro. A interface foi estruturada para ser intuitiva, com campos como nome, e-mail e senha. 

2 - Criar banco de dados para armazenar informações de login

Foi criado o banco de dados inicial contendo as tabelas responsáveis por armazenar credenciais e informações de autenticação dos usuários.

3 - Autenticar informações

Implementou-se a lógica de autenticação, validando credenciais inseridas pelo usuário e comparando-as com os dados armazenados no banco. O sistema bloqueia acessos inválidos e garante que apenas usuários cadastrados possam prosseguir para a área interna da aplicação. A autenticação inclui verificação de senha e e-mail.

4 - Salvar informações de cadastro no banco de dados

Foi desenvolvida a lógica que permite inserir novos usuários no banco. Durante o cadastro, os dados passam por validação. Após aprovação, as informações são persistidas de forma segura na tabela de usuários, garantindo consistência para os logins futuros.

5 - Criar interface principal contendo a rotina gamificada

A partir do login, foi desenvolvida a tela principal que exibe a rotina gamificada do usuário. Essa interface apresenta as tarefas diárias que o paciente deve realizar (alimentação e exercícios físicos). A tela já inclui elementos de gamificação, como área de pontuação e progresso diário.

6 - Criar Menu de paginas

Foi implementado um menu de navegação lateral, permitindo acesso às principais áreas do sistema: dashboard e agendamento (agendamento ainda não foi implementado).

7 - Criar tarefas da rotina

As tarefas gamificadas foram definidas e integradas ao sistema. Cada tarefa possui uma descrição e categoria (alimentação, exercício). Também foram criadas as lógicas para marcar uma tarefa como concluída, e cada usuário pode criar quantas tarefas desejar.

8 - Salvar rotinas no banco de dados

As rotinas e tarefas concluídas passaram a ser registradas no banco de dados, garantindo persistência diária das informações. Cada tarefa concluída é associada ao usuário e data.

**Respectivos Responsáveis**
Beatriz:  7, 8, 3
Eduardo: 1, 6, 5
Maria Clara: 2, 3, 4

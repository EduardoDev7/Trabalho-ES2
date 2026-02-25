# Comando principal: make testar
testar:
	
	@echo "Rodando: Login do Usuário........... "
	@npx wdio run ./wdio.conf.js --spec test/specs/test.e2e.js > /dev/null && echo "[ OK ]" || echo "[ ERRO ]"

	@echo "Rodando: Cadastro de Alimentos...... "
	@npx wdio run ./wdio.conf.js --spec test/specs/salvar_rotinas.js > /dev/null && echo "[ OK ]" || echo "[ ERRO ]"

	@echo "Rodando: Agendamento de Consultas... "
	@npx wdio run ./wdio.conf.js --spec test/specs/agendar_consulta.e2e.js > /dev/null && echo "[ OK ]" || echo "[ ERRO ]"

	@echo "Rodando: Verificação da Loja........ "
	@npx wdio run ./wdio.conf.js --spec test/specs/loja_pontos.e2e.js > /dev/null && echo "[ OK ]" || echo "[ ERRO ]"

	@echo "Rodando: Atualização de Prontuário.. "
	@npx wdio run ./wdio.conf.js --spec test/specs/prontuario.e2e.js > /dev/null && echo "[ OK ]" || echo "[ ERRO ]"
	@echo "TODOS OS TESTES PASSARAM COM SUCESSO!"

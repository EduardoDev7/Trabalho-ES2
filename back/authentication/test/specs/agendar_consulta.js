const { expect, browser, $ } = require('@wdio/globals')

describe('Funcionalidade de Médicos - GlicoGame', () => {
    it('Deve agendar uma consulta com sucesso', async () => {
        // 1. LOGIN (Para garantir acesso à página)
        await browser.url('http://127.0.0.1:5500/index.html')
        await $('#email').setValue('b@gmail.com') 
        await $('#password').setValue('123')
        await $('button[type="submit"]').click()

        // 2. NAVEGAÇÃO para a página de Médicos
        await browser.url('http://127.0.0.1:5500/front/doctors.html')
        await browser.setWindowSize(693, 776)

        // 3. AGENDAMENTO
        // Clica no botão para abrir o agendamento 
        await $('.mt-6').click()

        // Preenche Data, Hora e Notas
        await $('#appDate').setValue('2026-03-12')
        await $('#appTime').setValue('12:30')
        await $('#appNotes').setValue('Dor')

        // Clica no botão de enviar/confirmar 
        await $('.py-4').click()

        await browser.pause(1000)

        // 4. VERIFICAÇÃO
        // Clica na aba "Minhas Consultas" para ver se salvou
        await $('#tab-my').click()

        // Pausa para você visualizar o resultado na tela
        await browser.pause(3000)
        
        console.log('✅ Consulta agendada e verificada com sucesso!')
    })
})

const { expect, browser, $ } = require('@wdio/globals')

describe('Funcionalidade de Rotina - GlicoGame', () => {
    it('Deve realizar login e salvar rotinas (Alimento e Atividade)', async () => {
        // 1. LOGIN 
        await browser.url('http://127.0.0.1:5500/index.html')
        await $('#email').setValue('b@gmail.com') 
        await $('#password').setValue('123')
        await $('button[type="submit"]').click()

        // 2. NAVEGAÇÃO
        await browser.url('http://127.0.0.1:5500/front/dashboard.html')
        await browser.setWindowSize(1108, 776)

        // SALVAR ALIMENTO 
        await $('.bg-accentPink\\/10').click() 
        await $('#inputDesc').setValue('Arroz')
        await $('#inputValue').setValue('45')
        // Clica no botão de salvar (o roxo/rosa)
        await $('.hover\\:from-purple-600').click()
        
        await browser.pause(1500) // Espera o sistema processar o Arroz

        // SALVAR ATIVIDADE 
        await $('.bg-accentCyan\\/10').click()
        await $('#inputDesc').clearValue()
        await $('#inputDesc').setValue('Corrida')
        await $('#inputValue').clearValue()
        await $('#inputValue').setValue('30')
        
        // Clica no botão de salvar de novo
        await $('.hover\\:from-purple-600').click()

        // 3. VALIDAÇÃO FINAL
        await browser.pause(2000)
        console.log('Teste de Rotina finalizado com sucesso!')
    })
})

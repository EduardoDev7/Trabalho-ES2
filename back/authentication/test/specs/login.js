const { expect, browser, $ } = require('@wdio/globals')

describe('Teste de Autenticação - GlicoGame', () => {
    it('Deve realizar login com sucesso', async () => {
        // 1. Abre o site 
        await browser.url('http://127.0.0.1:5500/index.html')

        // 2. Preenche os campos com os seus dados
        await $('#email').setValue('b@gmail.com') 
        await $('#password').setValue('123')

        // 3. Clica no botão de entrar
        await $('button[type="submit"]').click()

        // 4. Pausa de 3 segundos para você (e a professora) verem o login acontecendo
        await browser.pause(3000)

        // 5. Verifica se o login funcionou
        await expect(browser).toHaveUrl(expect.stringContaining('dashboard.html'))
    })
})

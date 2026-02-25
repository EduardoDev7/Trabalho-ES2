const { expect, browser, $ } = require('@wdio/globals')

describe('Funcionalidade da Loja - GlicoGame', () => {
    it('Deve visitar a loja de pontos e retornar ao dashboard', async () => {
        // 1. LOGIN (Necessário para manter a sessão ativa)
        await browser.url('http://127.0.0.1:5500/index.html')
        await $('#email').setValue('b@gmail.com') 
        await $('#password').setValue('123')
        await $('button[type="submit"]').click()

        // 2. NAVEGAÇÃO para o Dashboard
        await browser.url('http://127.0.0.1:5500/front/dashboard.html')
        await browser.setWindowSize(1223, 776)

        // 3. ENTRAR NA LOJA
        const linkLoja = await $('.hover\\:text-accentPink')
        await linkLoja.click()

        // Pausa para ver a loja carregando
        await browser.pause(2000)

        // 4. VOLTAR PARA O DASHBOARD
        // Usando o linkText que o Selenium gravou: "← Voltar"
        const btnVoltar = await $('=← Voltar')
        await btnVoltar.click()

        // 5. VALIDAÇÃO
        // Verifica se voltou para a URL do dashboard
        await expect(browser).toHaveUrl(expect.stringContaining('dashboard.html'))
        
        await browser.pause(2000)
        console.log('✅ Visita à loja concluída com sucesso!')
    })
})

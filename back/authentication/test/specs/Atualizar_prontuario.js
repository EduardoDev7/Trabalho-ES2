const { expect, browser, $ } = require('@wdio/globals')

describe('Funcionalidade de Prontuário - GlicoGame', () => {
    it('Deve preencher e salvar o prontuário do paciente', async () => {
        // 1. LOGIN
        await browser.url('http://127.0.0.1:5500/index.html')
        await $('#email').setValue('b@gmail.com') 
        await $('#password').setValue('123')
        await $('button[type="submit"]').click()

        // 2. NAVEGAÇÃO para o Histórico/Prontuário
        await browser.url('http://127.0.0.1:5500/front/history.html')
        await browser.setWindowSize(693, 776)

        // 3. PREENCHIMENTO DO PRONTUÁRIO
        const selectDiabetes = await $('#diabetesType')
        await selectDiabetes.selectByVisibleText('Pré-diabetes')

        // Preenche Data de Diagnóstico
        await $('#diagnosisDate').setValue('2004-07-12')

        // Alergias e Medicamentos
        await $('#allergies').setValue('Dipirona')
        await $('#medications').setValue('Levoid')

        // Notas adicionais
        await $('#notes').setValue('Não tem')

        // 4. SALVAR
        const btnSalvar = await $('.bg-accentGreen')
        await btnSalvar.click()

        // 5. VALIDAÇÃO
        await browser.pause(3000)
        console.log('Prontuário salvo com sucesso!')
    })
})

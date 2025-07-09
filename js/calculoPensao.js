document.addEventListener("DOMContentLoaded", function () {
    const inBaseInss = document.getElementById("inBaseInss");
    const inBasePensao = document.getElementById("inBasePensao");
    const inPorcPensao = document.getElementById("inPorcPensao");
    const inQtDep = document.getElementById("inQtDep");
    const dataReferenciaInput = document.getElementById("dataReferencia");
    const btnCalcular = document.getElementById("btnCalcular");

    const outPensao1 = document.getElementById("outPensao");
    const outPensao2 = document.getElementById("outPensao2");
    const outPensao3 = document.getElementById("outPensao3");
    const outPensao4 = document.getElementById("outPensao4");
    const outPensao5 = document.getElementById("outPensao5");
    const outIrrf = document.getElementById("outIrrf");
    const outPensaoFinal = document.getElementById("outPensaoFinal");
    const mensagemErro = document.getElementById("mensagemErro");
    const outInss = document.getElementById("outInss");

    let dadosInss = null;
    let dadosIrrf = null;

    async function carregarDados() {
        try {
            btnCalcular.disabled = true;
            btnCalcular.value = "Carregando...";
            
            const [respostaInss, respostaIrrf] = await Promise.all([
                fetch('dados/tabela_inss.json'),
                fetch('dados/tabela_irrf.json')
            ]);

            if (!respostaInss.ok || !respostaIrrf.ok) {
                throw new Error('Falha ao buscar arquivos de dados. Verifique a estrutura de pastas.');
            }

            [dadosInss, dadosIrrf] = await Promise.all([respostaInss.json(), respostaIrrf.json()]);

            btnCalcular.disabled = false;
            btnCalcular.value = "Calcular";
        } catch (error) {
            console.error("Erro fatal ao carregar dados:", error);
            mensagemErro.textContent = "Erro ao carregar tabelas. Verifique o console e a estrutura de pastas.";
        }
    }

    function encontrarTabelaPorData(tabelas, dataCalculo) {
        const data = new Date(dataCalculo + 'T12:00:00Z');
        for (const tabela of tabelas) {
            const vigencia = tabela.vigencia;
            if (vigencia.startsWith('A partir de')) {
                const [dia, mes, ano] = vigencia.replace('A partir de ', '').split('/');
                if (data >= new Date(`${ano}-${mes}-${dia}T12:00:00Z`)) return tabela;
            } else if (vigencia.startsWith('De ')) {
                const partes = vigencia.replace('De ', '').split(' a ');
                const [diaInicio, mesInicio, anoInicio] = partes[0].split('/');
                const [diaFim, mesFim, anoFim] = partes[1].split('/');
                if (data >= new Date(`${anoInicio}-${mesInicio}-${diaInicio}T12:00:00Z`) && data <= new Date(`${anoFim}-${mesFim}-${diaFim}T12:00:00Z`)) return tabela;
            }
        }
        return null;
    }

    function calcularINSS(salarioBruto, tabelaInss) {
        if (!tabelaInss) return 0;
        let inssCalculado = 0;
        const salarioBase = Math.min(salarioBruto, tabelaInss.teto_salarial);
        if (tabelaInss.progressiva) {
            let salarioRestante = salarioBase, baseFaixaAnterior = 0;
            for (const faixa of tabelaInss.faixas) {
                if (salarioRestante <= 0) break;
                const limiteFaixa = faixa.salario_ate - baseFaixaAnterior;
                const valorNaFaixa = Math.min(salarioRestante, limiteFaixa);
                inssCalculado += valorNaFaixa * (faixa.aliquota / 100);
                salarioRestante -= valorNaFaixa;
                baseFaixaAnterior = faixa.salario_ate;
            }
        } else {
            for (const faixa of tabelaInss.faixas) {
                if (salarioBase <= faixa.salario_ate) {
                    inssCalculado = salarioBase * (faixa.aliquota / 100);
                    break;
                }
            }
        }
        return parseFloat(inssCalculado.toFixed(2));
    }

    function calcularIRRF(salarioBruto, valorInss, valorPensao, numDependentes, tabelaIrrf) {
        if (!tabelaIrrf) return { valor: 0, deducaoTotal: 0 };
        const deducaoDependentes = numDependentes * tabelaIrrf.deducao_por_dependente;
        const deducaoSimplificada = parseFloat(tabelaIrrf.deducao_simplificada) || 0;
        const deducaoPadraoTotal = valorInss + deducaoDependentes + valorPensao;
        
        let baseCalculoFinal;
        let deducaoFinalUsada;

        if (deducaoSimplificada > 0 && deducaoSimplificada > deducaoPadraoTotal) {
            baseCalculoFinal = salarioBruto - deducaoSimplificada;
            deducaoFinalUsada = deducaoSimplificada;
        } else {
            baseCalculoFinal = salarioBruto - deducaoPadraoTotal;
            deducaoFinalUsada = deducaoPadraoTotal;
        }
        
        if (baseCalculoFinal < 0) baseCalculoFinal = 0;
        
        let irrfValor = 0;
        for (const faixa of tabelaIrrf.faixas) {
            if (faixa.base_calculo_ate === 'acima' || baseCalculoFinal <= faixa.base_calculo_ate) {
                irrfValor = (baseCalculoFinal * (faixa.aliquota / 100)) - faixa.parcela_a_deduzir;
                break;
            }
        }
        
        return {
            valor: parseFloat(Math.max(0, irrfValor).toFixed(2)),
            deducaoTotal: parseFloat(deducaoFinalUsada.toFixed(2))
        };
    }

    function handleCalcular() {
        mensagemErro.textContent = "";
        const outputs = [outPensao1, outPensao2, outPensao3, outPensao4, outPensao5, outIrrf, outPensaoFinal, outInss];
        outputs.forEach(el => { if(el) el.textContent = "" });

        const salarioBruto = parseFloat(inBaseInss.value) || 0;
        const basePensao = parseFloat(inBasePensao.value) || 0;
        const porcPensaoValor = parseFloat(inPorcPensao.value) || 0;
        const porcentagem = porcPensaoValor / 100;
        const numDependentes = parseInt(inQtDep.value) || 0;
        const dataReferencia = dataReferenciaInput.value;

        if (!dataReferencia) {
            mensagemErro.textContent = "Selecione a data de referência.";
            return;
        }
        if (salarioBruto <= 0 || basePensao <= 0 || porcentagem <= 0) {
            mensagemErro.textContent = "Preencha todos os valores de base e porcentagem.";
            return;
        }

        const tabelaInss = encontrarTabelaPorData(dadosInss.inss_tabelas, dataReferencia);
        const tabelaIrrf = encontrarTabelaPorData(dadosIrrf.irrf_tabelas, dataReferencia);
        if (!tabelaInss || !tabelaIrrf) {
            mensagemErro.textContent = "Não há tabelas para a data selecionada.";
            return;
        }
        
        const valorInss = calcularINSS(salarioBruto, tabelaInss);

        let irrf0 = calcularIRRF(salarioBruto, valorInss, 0, numDependentes, tabelaIrrf).valor;
        let pensao1 = Math.max(0, (basePensao - valorInss - irrf0) * porcentagem);
        outPensao1.textContent = `Pensão (Cálculo 1): R$ ${pensao1.toFixed(2)}`;

        let irrf1 = calcularIRRF(salarioBruto, valorInss, pensao1, numDependentes, tabelaIrrf).valor;
        let pensao2 = Math.max(0, (basePensao - valorInss - irrf1) * porcentagem);
        outPensao2.textContent = `Pensão (Cálculo 2): R$ ${pensao2.toFixed(2)}`;

        let irrf2 = calcularIRRF(salarioBruto, valorInss, pensao2, numDependentes, tabelaIrrf).valor;
        let pensao3 = Math.max(0, (basePensao - valorInss - irrf2) * porcentagem);
        outPensao3.textContent = `Pensão (Cálculo 3): R$ ${pensao3.toFixed(2)}`;

        let irrf3 = calcularIRRF(salarioBruto, valorInss, pensao3, numDependentes, tabelaIrrf).valor;
        let pensao4 = Math.max(0, (basePensao - valorInss - irrf3) * porcentagem);
        outPensao4.textContent = `Pensão (Cálculo 4): R$ ${pensao4.toFixed(2)}`;
        
        let irrf4 = calcularIRRF(salarioBruto, valorInss, pensao4, numDependentes, tabelaIrrf).valor;
        let pensao5 = Math.max(0, (basePensao - valorInss - irrf4) * porcentagem);
        outPensao5.textContent = `Pensão (Cálculo 5): R$ ${pensao5.toFixed(2)}`;

        const { valor: irrfFinal, deducaoTotal: deducaoFinal } = calcularIRRF(salarioBruto, valorInss, pensao5, numDependentes, tabelaIrrf);
        let pensaoFinalValue = Math.max(0, (basePensao - valorInss - irrfFinal) * porcentagem);
        
        if(outInss) outInss.textContent = `Desconto INSS: R$ ${valorInss.toFixed(2)}`;
        
        if (irrfFinal > 0) {
            outIrrf.textContent = `IRRF: R$ ${irrfFinal.toFixed(2)} e foi utilizado o desconto: R$ ${deducaoFinal.toFixed(2)}`;
        } else {
            outIrrf.textContent = `IRRF: R$ 0.00`;
        }
        
        if(outPensaoFinal) {
            outPensaoFinal.textContent = `Valor da Pensão de ${porcPensaoValor}%: ${pensaoFinalValue.toFixed(2)}`;
        }
    }

    if (dataReferenciaInput) {
        dataReferenciaInput.value = new Date().toISOString().split('T')[0];
    }
    
    carregarDados();

    btnCalcular.addEventListener("click", handleCalcular);
});

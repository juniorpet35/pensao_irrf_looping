function calculoInss() {
    // Faixas e alíquotas de INSS - Ano 2025
    let inssFaixa1 = 1518;
    let inssFaixa2A = inssFaixa1 + 0.01;
    let inssFaixa2B = 2793.88;
    let inssFaixa3A = inssFaixa2B + 0.01;
    let inssFaixa3B = 4190.83;
    let inssFaixa4A = inssFaixa3B + 0.01;
    let inssFaixa4B = 8157.41;

    let aliqFaixa1 = 0.075;
    let aliqFaixa2 = 0.09;
    let aliqFaixa3 = 0.12;
    let aliqFaixa4 = 0.14;

    let inssTeto = 951.63;

    //-----------------------//

    let inBaseInss = document.getElementById("inBaseInss");
    let mensagem = document.getElementById("mensagemErro"); // Campo para exibir mensagens
    let valor = Number(inBaseInss.value);

    // Forçar usuário a digitar um valor numérico válido
    if (isNaN(valor) || valor == "" || valor <= 0) {
        mensagem.textContent = "Digite um valor válido para calcular a sua remuneração.";
        inBaseInss.focus();
        inBaseInss.value = "";
        return;
    } else {
        mensagem.textContent = ""; // Limpa mensagem de erro se a entrada for válida
    }

    let inss = 0;

    // Condições para o cálculo do INSS
    if (valor > 0 && valor <= inssFaixa1) {
        inss = valor * aliqFaixa1;
    } else if (valor > inssFaixa1 && valor <= inssFaixa2B) {
        inss = ((valor - inssFaixa1) * aliqFaixa2) + (inssFaixa1 * aliqFaixa1);
    } else if (valor > inssFaixa2B && valor <= inssFaixa3B) {
        inss = (inssFaixa1 * aliqFaixa1) + ((inssFaixa2B - inssFaixa1) * aliqFaixa2) + ((valor - inssFaixa2B) * aliqFaixa3);
    } else if (valor > inssFaixa3B && valor <= inssFaixa4B) {
        inss = (inssFaixa1 * aliqFaixa1) + ((inssFaixa2B - inssFaixa1) * aliqFaixa2) + ((inssFaixa3B - inssFaixa2B) * aliqFaixa3) + ((valor - inssFaixa3B) * aliqFaixa4);
    } else if (valor > inssFaixa4B) {
        inss = inssTeto;
    }

    // Retorna valor do INSS
    return inss;
}

function pensaoIrrf(){
    let inBaseInss = document.getElementById("inBaseInss");
    let valorIr = parseFloat(inBaseInss.value);  // Obtém o valor do salário para cálculo do IRRF
    let inQtDep = document.getElementById("inQtDep");
    let inss = calculoInss();
    let pensao0 = 0;

        // Faixas e Alíquotas de IRRF.

        let tabelaIrFaixa0 = 2259.60;
        let tabelaIrFaixa1 = 2826.65;
        let tabelaIrFaixa2 = 3751.05; 
        let tabelaIrFaixa3 = 4664.68;
        
        let faixaUmIr = 169.44;
        let faixaDoisIr = 381.44;
        let faixaTresIr = 662.77;
        let faixaQuatroIr = 896.00;
    
        let qtDep = Number(inQtDep.value);
        let valorDep = qtDep * 189.59;
    
        let deducao = 0;
        if ((inss + valorDep) < 564.80){
            deducao = 564.80;
        }else {
            deducao = (inss + valorDep);
        }
    
        let baseInss = Number(inBaseInss.value)
        let novoValor = (baseInss - deducao);
    
        if (novoValor <= tabelaIrFaixa0) {
        } else if (novoValor >= (tabelaIrFaixa0 + 0.01) && novoValor <= tabelaIrFaixa1) {
            pensao0 = ((valorIr - deducao) * 0.075) - faixaUmIr;
            if (pensao0 < 0){
            } else {
            }
        } else if (novoValor >= tabelaIrFaixa1 + 0.01 && novoValor <= tabelaIrFaixa2) {
            pensao0 = ((valorIr - deducao) * 0.15) - faixaDoisIr;
            if (pensao0 < 0){
            } else {
            }
        } else if (novoValor >= tabelaIrFaixa2 + 0.01 && novoValor <= tabelaIrFaixa3) {
            pensao0 = ((valorIr - deducao) * 0.225) - faixaTresIr;
        } else if (novoValor >= tabelaIrFaixa3 + 0.01) {
            pensao0 = ((valorIr - deducao) * 0.275) - faixaQuatroIr;
        }
    
        //Retorna valor do IRRF para a função cálculo de impostos.
        return pensao0;
}

function calculoPensao(){
    let pensao0 = pensaoIrrf();
    let inBasePensao = document.getElementById("inBasePensao");
    let inBaseInss = document.getElementById("inBaseInss");
    let inPorcPensao = document.getElementById("inPorcPensao");
    let inQtDep = document.getElementById("inQtDep");
    let basePensao = Number(inBasePensao.value);
    let baseInss = Number(inBaseInss.value);
    let inss = calculoInss();
    let outPensao = document.getElementById("outPensao");
    let porcentagem = Number(inPorcPensao.value) / 100;
    let pensao1 = 0;
    let pensao2 = 0;
    let pensao3 = 0;
    let pensao4 = 0;
    let pensao5 = 0;

    let qtDep = Number(inQtDep.value);
    let valorDep = qtDep * 189.59;
    let deducaoLegal;
    let deducaoSimplificada = 564.80;
    let deducao;

    if (inss + valorDep < deducaoSimplificada){
        deducao = deducaoSimplificada;
    } else {
        deducao = deducaoLegal;
    }

    pensao1 = (basePensao - inss - pensao0) * porcentagem;
    outPensao.textContent = `Valor da pensao1: ${pensao1.toFixed(2)}`;

    function _irrfPensao1(){
        let inBaseInss = document.getElementById("inBaseInss");
        let valorIr = parseFloat(inBaseInss.value);
        let inss = calculoInss();
        let irrfPensao1 = 0;
        // Faixas e Alíquotas de IRRF.
        let tabelaIrFaixa0 = 2259.60;
        let tabelaIrFaixa1 = 2826.65;
        let tabelaIrFaixa2 = 3751.05; 
        let tabelaIrFaixa3 = 4664.68;
        //------------------------------//
        let faixaUmIr = 169.44;
        let faixaDoisIr = 381.44;
        let faixaTresIr = 662.77;
        let faixaQuatroIr = 896.00;
        //------------------------------//
        let qtDep = Number(inQtDep.value);
        let valorDep = qtDep * 189.59;
    	//------------------------------//
        let deducao = 0;
        if ((inss + pensao1 + valorDep) < 564.80){
            deducao = 564.80;
        }else {
            deducao = (inss + pensao1 + valorDep);
        }
    
        let novoValor = (inBaseInss.value - deducao);
    
        if (novoValor <= tabelaIrFaixa0) {
        } else if (novoValor >= (tabelaIrFaixa0 + 0.01) && novoValor <= tabelaIrFaixa1) {
            irrfPensao1 = ((valorIr - deducao) * 0.075) - faixaUmIr;
            if (irrfPensao1 < 0){
            } else {
            }
        } else if (novoValor >= tabelaIrFaixa1 + 0.01 && novoValor <= tabelaIrFaixa2) {
            irrfPensao1 = ((valorIr - deducao) * 0.15) - faixaDoisIr;
            if (irrfPensao1 < 0){
            } else {
            }
        } else if (novoValor >= tabelaIrFaixa2 + 0.01 && novoValor <= tabelaIrFaixa3) {
            irrfPensao1 = ((valorIr - deducao) * 0.225) - faixaTresIr;
        } else if (novoValor >= tabelaIrFaixa3 + 0.01) {
            irrfPensao1 = ((valorIr - deducao) * 0.275) - faixaQuatroIr;
        }

        return irrfPensao1;
    }

    //--clacular pensao2 deduzindo a pensao1 da base--
    let irrfPensao1 = _irrfPensao1();
    pensao2 = (basePensao - inss - irrfPensao1) * porcentagem;
    let outPensao2 = document.getElementById("outPensao2");
    outPensao2.textContent = `Valor da pensao2: ${pensao2.toFixed(2)}`;

    function _irrfPensao2(){
        let inBaseInss = document.getElementById("inBaseInss");
        let valorIr = parseFloat(inBaseInss.value);
        let inss = calculoInss();
        let irrfPensao2 = 0;
        // Faixas e Alíquotas de IRRF.
        let tabelaIrFaixa0 = 2259.60;
        let tabelaIrFaixa1 = 2826.65;
        let tabelaIrFaixa2 = 3751.05; 
        let tabelaIrFaixa3 = 4664.68;
        //------------------------------//
        let faixaUmIr = 169.44;
        let faixaDoisIr = 381.44;
        let faixaTresIr = 662.77;
        let faixaQuatroIr = 896.00;
        //------------------------------//
        let qtDep = Number(inQtDep.value);
        let valorDep = qtDep * 189.59;
    	//------------------------------//
        let deducao = 0;
        if ((inss + pensao2 + valorDep) < 564.80){
            deducao = 564.80;
        }else {
            deducao = (inss + pensao2 + valorDep);
        }
    
        let novoValor = (inBaseInss.value - deducao);
    
        if (novoValor <= tabelaIrFaixa0) {
        } else if (novoValor >= (tabelaIrFaixa0 + 0.01) && novoValor <= tabelaIrFaixa1) {
            irrfPensao2 = ((valorIr - deducao) * 0.075) - faixaUmIr;
            if (irrfPensao2 < 0){
            } //else {
            //}
        } else if (novoValor >= tabelaIrFaixa1 + 0.01 && novoValor <= tabelaIrFaixa2) {
            irrfPensao2 = ((valorIr - deducao) * 0.15) - faixaDoisIr;
            if (irrfPensao2 < 0){
            } //else {
            //}
        } else if (novoValor >= tabelaIrFaixa2 + 0.01 && novoValor <= tabelaIrFaixa3) {
            irrfPensao2 = ((valorIr - deducao) * 0.225) - faixaTresIr;
        } else if (novoValor >= tabelaIrFaixa3 + 0.01) {
            irrfPensao2 = ((valorIr - deducao) * 0.275) - faixaQuatroIr;
        }
        
        return irrfPensao2;
    }

    let irrfPensao2 = _irrfPensao2();
    pensao3 = (basePensao - inss - irrfPensao2) * porcentagem;
    let outPensao3 = document.getElementById("outPensao3");
    outPensao3.textContent = `Valor da pensao3: ${pensao3.toFixed(2)}`;

    function _irrfPensao3(){
        let inBaseInss = document.getElementById("inBaseInss");
        let valorIr = parseFloat(inBaseInss.value);
        let inss = calculoInss();
        let irrfPensao3 = 0;
        // Faixas e Alíquotas de IRRF.
        let tabelaIrFaixa0 = 2259.60;
        let tabelaIrFaixa1 = 2826.65;
        let tabelaIrFaixa2 = 3751.05; 
        let tabelaIrFaixa3 = 4664.68;
        //------------------------------//
        let faixaUmIr = 169.44;
        let faixaDoisIr = 381.44;
        let faixaTresIr = 662.77;
        let faixaQuatroIr = 896.00;
        //------------------------------//
        let qtDep = Number(inQtDep.value);
        let valorDep = qtDep * 189.59;
    	//------------------------------//
        let deducao = 0;
        if ((inss + pensao3 + valorDep) < 564.80){
            deducao = 564.80;
        }else {
            deducao = (inss + pensao3 + valorDep);
        }

        let novoValor = (inBaseInss.value - deducao);
    
        if (novoValor <= tabelaIrFaixa0) {
        } else if (novoValor >= (tabelaIrFaixa0 + 0.01) && novoValor <= tabelaIrFaixa1) {
            irrfPensao3 = ((valorIr - deducao) * 0.075) - faixaUmIr;
            if (irrfPensao3 < 0){
            } else {
            }
        } else if (novoValor >= tabelaIrFaixa1 + 0.01 && novoValor <= tabelaIrFaixa2) {
            irrfPensao3 = ((valorIr - deducao) * 0.15) - faixaDoisIr;
            if (irrfPensao3 < 0){
            } else {
            }
        } else if (novoValor >= tabelaIrFaixa2 + 0.01 && novoValor <= tabelaIrFaixa3) {
            irrfPensao3 = ((valorIr - deducao) * 0.225) - faixaTresIr;
        } else if (novoValor >= tabelaIrFaixa3 + 0.01) {
            irrfPensao3 = ((valorIr - deducao) * 0.275) - faixaQuatroIr;
        }

        return irrfPensao3;
    }
    
    let irrfPensao3 = _irrfPensao3();
    pensao4 = (basePensao - inss - irrfPensao3) * porcentagem;
    let outPensao4 = document.getElementById("outPensao4");
    outPensao4.textContent = `Valor da pensao4: ${pensao4.toFixed(2)}`;

    function _irrfPensao4(){
        let inBaseInss = document.getElementById("inBaseInss");
        let valorIr = parseFloat(inBaseInss.value);
        let inss = calculoInss();
        let irrfPensao4 = 0;
        // Faixas e Alíquotas de IRRF.
        let tabelaIrFaixa0 = 2259.60;
        let tabelaIrFaixa1 = 2826.65;
        let tabelaIrFaixa2 = 3751.05; 
        let tabelaIrFaixa3 = 4664.68;
        //------------------------------//
        let faixaUmIr = 169.44;
        let faixaDoisIr = 381.44;
        let faixaTresIr = 662.77;
        let faixaQuatroIr = 896.00;
        //------------------------------//
        let qtDep = Number(inQtDep.value);
        let valorDep = qtDep * 189.59;
    	//------------------------------//
        let deducao = 0;
        if ((inss + pensao4 + valorDep) < 564.80){
            deducao = 564.80;
        }else {
            deducao = (inss + pensao3 + valorDep);
        }
    
        let novoValor = (inBaseInss.value - deducao);
    
        if (novoValor <= tabelaIrFaixa0) {
        } else if (novoValor >= (tabelaIrFaixa0 + 0.01) && novoValor <= tabelaIrFaixa1) {
            irrfPensao4 = ((valorIr - deducao) * 0.075) - faixaUmIr;
            if (irrfPensao4 < 0){
            } else {
            }
        } else if (novoValor >= tabelaIrFaixa1 + 0.01 && novoValor <= tabelaIrFaixa2) {
            irrfPensao4 = ((valorIr - deducao) * 0.15) - faixaDoisIr;
            if (irrfPensao4 < 0){
            } else {
            }
        } else if (novoValor >= tabelaIrFaixa2 + 0.01 && novoValor <= tabelaIrFaixa3) {
            irrfPensao4 = ((valorIr - deducao) * 0.225) - faixaTresIr;
        } else if (novoValor >= tabelaIrFaixa3 + 0.01) {
            irrfPensao4 = ((valorIr - deducao) * 0.275) - faixaQuatroIr;
        }

        return irrfPensao4;
    }

    let irrfPensao4 = _irrfPensao4();
    pensao5 = (basePensao - inss - irrfPensao4) * porcentagem;
    let outPensao5 = document.getElementById("outPensao5");
    outPensao5.textContent = `Valor da Pensão 5: ${pensao5.toFixed(2)}`;

    if(baseInss <= 0 || basePensao <= 0 || isNaN(basePensao) || isNaN(baseInss) || baseInss == "" || basePensao == ""){
        outPensao.textContent = "";
        outPensao2.textContent = ""
        outPensao3.textContent = ""
        outPensao4.textContent = ""
        outPensao5.textContent = ""
    }

    let pensao = pensao5;
    return pensao;
}

function calculoIrrf(){
    let pensao = calculoPensao();
    let inss = calculoInss();
    let inBasePensao = document.getElementById("inBasePensao");
    let outIrrf = document.getElementById("outIrrf");
    let inBaseInss = document.getElementById("inBaseInss");
    let valorIr = parseFloat(inBaseInss.value);  // Obtém o valor do salário para cálculo do IRRF
    let inQtDep = document.getElementById("inQtDep");

    // Faixas e Alíquotas de IRRF.

    let tabelaIrFaixa0 = 2259.60;
    let tabelaIrFaixa1 = 2826.65;
    let tabelaIrFaixa2 = 3751.05; 
    let tabelaIrFaixa3 = 4664.68;
    
    let irrf = 0;
    let faixaUmIr = 169.44;
    let faixaDoisIr = 381.44;
    let faixaTresIr = 662.77;
    let faixaQuatroIr = 896.00;

    let qtDep = inQtDep.value;
    let valorDep = qtDep * 189.59;

    if (inQtDep.value == 0){
        inQtDep.value = 1;
    }

    let deducao = 0;
    if (564.80 > (inss + pensao + valorDep)){
        deducao = 564.80;
    }else {
        deducao = (inss + pensao + valorDep);
    }

    let outPensao = document.getElementById("outPensao");
    let outPensao2 = document.getElementById("outPensao2");
    let outPensao3 = document.getElementById("outPensao3");
    let outPensao4 = document.getElementById("outPensao4");
    let outPensao5 = document.getElementById("outPensao5");
    if (qtDep < 1){
        alert("A quantidade de dependentes não pode ser menor que 1!");
        qtDep = 1;
        outPensao.textContent = "";
        outPensao2.textContent = "";
        outPensao3.textContent = "";
        outPensao4.textContent = "";
        outPensao5.textContent = "";
        outIrrf.textContent = "";
        return;
    }

    let novoValor = (inBaseInss.value - deducao);

    if (novoValor <= tabelaIrFaixa0) {
        outIrrf.textContent = "Você não teve desconto de IRRF";
    } else if (novoValor >= (tabelaIrFaixa0 + 0.01) && novoValor <= tabelaIrFaixa1) {
        irrf = ((valorIr - deducao) * 0.075) - faixaUmIr;
        if (irrf < 0){
            outIrrf.textContent = "Você não teve desconto de IRRF";
        } else {
            outIrrf.textContent = "IRRF: R$ " + irrf.toFixed(2) + "\n e foi utilizado o desconto: R$ " + deducao.toFixed(2);
        }
    } else if (novoValor >= tabelaIrFaixa1 + 0.01 && novoValor <= tabelaIrFaixa2) {
        irrf = ((valorIr - deducao) * 0.15) - faixaDoisIr;
        if (irrf < 0){
            outIrrf.textContent = "Você não tem desconto de IRRF";
        } else {
            outIrrf.textContent = "IRRF: R$ " + irrf.toFixed(2) + "\n e foi utilizado o desconto: R$ " + deducao.toFixed(2);
        }
    } else if (novoValor >= tabelaIrFaixa2 + 0.01 && novoValor <= tabelaIrFaixa3) {
        irrf = ((valorIr - deducao) * 0.225) - faixaTresIr;
        outIrrf.textContent = "IRRF: R$ " + irrf.toFixed(2)+ "\n e foi utilizado o desconto: R$ " + deducao.toFixed(2);
    } else if (novoValor >= tabelaIrFaixa3 + 0.01) {
        irrf = ((valorIr - deducao) * 0.275) - faixaQuatroIr;
        outIrrf.textContent = "IRRF: R$ " + irrf.toFixed(2)+ "\n e foi utilizado o desconto: R$ " + deducao.toFixed(2);
    }

    //Retorna valor do IRRF para a função cálculo de impostos.
    let outPensaoIrrf = document.getElementById("outPensaoIrrf");
    //outPensaoIrrf.textContent = irrf.toFixed(2);

    return irrf;
}

function pensaoFinal(){
    let irrf = calculoIrrf();
    let inss = calculoInss();
    let inBasePensao = document.getElementById("inBasePensao");
    let basePensao = Number(inBasePensao.value);
    let outPensaoFinal = document.getElementById("outPensaoFinal");
    let inPorcPensao = document.getElementById("inPorcPensao");
    let porcentagem = Number(inPorcPensao.value) / 100;

    let pensaoFinal = (basePensao - inss - irrf) * porcentagem;
    outPensaoFinal.textContent = `Valor da Pensão: ${pensaoFinal.toFixed(2)}`;
    return pensaoFinal;
}

function calcular(){
    calculoInss();
    calculoPensao();
    calculoIrrf();
    pensaoFinal();
    inBaseInss.focus();
}

let btnCalcular = document.getElementById("btnCalcular");
btnCalcular.addEventListener("click", calcular);
let custoTotal = 0;



// TAXA SELIC ---------------------------------------------------

// Função para buscar e exibir a taxa SELIC mais recente
function fetchSelicValue() {
    fetch("https://api.bcb.gov.br/dados/serie/bcdata.sgs.1178/dados?formato=json")
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                // Reverte a ordem dos dados e pega o primeiro valor para obter o mais recente
                data.reverse();
                const selicValue = data[0].valor;
                document.getElementById("selicValue").textContent = selicValue;
            } else {
                document.getElementById("selicValue").textContent = "Valores da taxa SELIC não encontrados.";
            }
        })
        .catch(error => {
            console.error("Erro ao buscar a taxa SELIC: " + error);
            document.getElementById("selicValue").textContent = "Erro ao buscar a taxa SELIC.";
        });
}

// Chama a função para buscar a taxa SELIC mais recente
fetchSelicValue();





//CONTA PARA POUPANÇA MENSAL --------------------------------------------------------------------------------
function calcularResultado() {
    // Obtenha o valor do elemento com o id "selicValue"
    var selicValueElement = document.getElementById("selicValue");
    var selicValue = parseFloat(selicValueElement.textContent) / 100;

    // Calcule o resultado
    var resultado = Math.pow(1 + (selicValue * 0.7), 1 / 12) - 1;

    // Exiba o resultado no elemento com o id "poupamensa"
    var poupamensaElement = document.getElementById("poupamensa");
    poupamensaElement.textContent = (resultado * 100).toFixed(3); // Converte para porcentagem e limita o número de casas decimais
}

// Atualize o resultado periodicamente (por exemplo, a cada segundo)
setInterval(calcularResultado, 1000);


// TEMPO (DIAS) -------------------------------------------------------------------------------------

// Função para calcular a diferença em dias entre duas datas
function calcularDiferencaDias() {
    const dataCompra = new Date(document.querySelector('.datacompra').value);
    const dataVenda = new Date(document.querySelector('.datavenda').value);

    const diferencaDias = Math.abs((dataVenda - dataCompra) / (1000 * 60 * 60 * 24));

    document.getElementById('tempodias').textContent = diferencaDias + ' dias';
}

// Adicionar um evento onchange para os campos de data
document.querySelector('.datacompra').addEventListener('change', calcularDiferencaDias);
document.querySelector('.datavenda').addEventListener('change', calcularDiferencaDias);


//  TEMPO (MESES) ----------------------------------------------------------------------------------------------------

// Função para calcular a diferença em meses entre duas datas
function calcularDiferencaMeses() {
    const dataCompra = new Date(document.querySelector('.datacompra').value);
    const dataVenda = new Date(document.querySelector('.datavenda').value);

    const diferencaMeses = (dataVenda.getMonth() + 1) + (dataVenda.getFullYear() - dataCompra.getFullYear()) * 12 - (dataCompra.getMonth() + 1);

    document.getElementById('tempomeses').textContent = diferencaMeses + ' meses';
}

// Adicionar um evento onchange para os campos de data
document.querySelector('.datacompra').addEventListener('change', calcularDiferencaMeses);
document.querySelector('.datavenda').addEventListener('change', calcularDiferencaMeses);


//PLACEHOLDER TEMPO DIA E MESES ------------------------------------------------------------------------------------------------------------------------------------

// Função para calcular a diferença em meses entre duas datas
function calcularDiferencaMeses() {
    const dataCompra = new Date(document.querySelector('.datacompra').value);
    const dataVenda = new Date(document.querySelector('.datavenda').value);
    const tempodiasSpan = document.getElementById('tempodias');
    const tempomesesSpan = document.getElementById('tempomeses');

    if (!isNaN(dataCompra) && !isNaN(dataVenda)) {
        const diferencaDias = Math.abs((dataVenda - dataCompra) / (1000 * 60 * 60 * 24));
        const diferencaMeses = (dataVenda.getMonth() + 1) + (dataVenda.getFullYear() - dataCompra.getFullYear()) * 12 - (dataCompra.getMonth() + 1);

        tempodiasSpan.textContent = diferencaDias + ' dias';
        tempomesesSpan.textContent = diferencaMeses + ' meses';
    } else {
        tempodiasSpan.textContent = 'Tempo em dias';
        tempomesesSpan.textContent = 'Tempo em meses';
    }
}

// Adicionar um evento onchange para os campos de data
document.querySelector('.datacompra').addEventListener('change', calcularDiferencaMeses);
document.querySelector('.datavenda').addEventListener('change', calcularDiferencaMeses);

// Calcular a diferença de meses na carga da página
calcularDiferencaMeses();






//FORMATAÇÃO DINHEIRO R$ ----------------------------------------------------------------------------------------------------------

// Adicionar eventos de entrada aos campos de valor pago e custos
const valorPagoInput = document.querySelector('.valorpago');
valorPagoInput.addEventListener('input', () => {
    formatInputCurrency(valorPagoInput);
    calcularCustoTotal();
});

const custosInput = document.querySelector('.custos');
custosInput.addEventListener('input', () => {
    formatInputCurrency(custosInput);
    calcularCustoTotal();
});

const custosvalorVendaInput = document.querySelector('.valorvenda');
custosvalorVendaInput.addEventListener('input', () => {
    formatInputCurrency(custosvalorVendaInput);
    calcularCustoTotal();
});

const deducoesInput = document.querySelector('.deducoes');
deducoesInput.addEventListener('input', () => {
    formatInputCurrency(deducoesInput);
    calcularCustoTotal();
});





// Eventos para calcular o custo total e o lucro final quando os campos são atualizados
document.querySelector('.valorpago').addEventListener('keyup', function() {
    calcularCustoTotal();
    calcularLucroFinal();
    calcularLucratividadeTotal(); // Atualize a lucratividade total quando um dos campos for atualizado
});
document.querySelector('.custos').addEventListener('keyup', function() {
    calcularCustoTotal();
    calcularLucroFinal();
    calcularLucratividadeTotal(); // Atualize a lucratividade total quando um dos campos for atualizado
});
document.querySelector('.valorvenda').addEventListener('keyup', function() {
    calcularLucroFinal();
    calcularLucratividadeTotal(); // Atualize a lucratividade total quando um dos campos for atualizado
});
document.querySelector('.deducoes').addEventListener('keyup', function() {
    calcularLucroFinal();
    calcularLucratividadeTotal(); // Atualize a lucratividade total quando um dos campos for atualizado
});



// VALOR PAGO + CUSTOS = CUSTOTOTAL -----------------------------------------------------------------------------------------------------------------

// Função para calcular o custo total
function calcularCustoTotal() {
    const valorPagoInput = document.querySelector('.valorpago');
    const custosInput = document.querySelector('.custos');
    const custoTotalElement = document.getElementById('custototal');

    // Obtém os valores formatados dos campos de entrada
    const valorPagoFormatted = valorPagoInput.value || '0'; // Se estiver vazio, considera como zero
    const custosFormatted = custosInput.value || '0'; // Se estiver vazio, considera como zero

    // Converte os valores formatados em números
    const valorPago = parseCurrency(valorPagoFormatted);
    const custos = parseCurrency(custosFormatted);

    custoTotal = valorPago + custos; // Armazena o valor do custo total na variável global

    // Exibe o custo total formatado
    custoTotalElement.textContent = formatCurrency(custoTotal);

    // Chama a função para recalcular o lucro final
    calcularLucroFinal();
}

// Função para analisar um valor monetário formatado (R$) e retornar um número
function parseCurrency(currencyString) {
    // Remove o "R$" e quaisquer separadores de milhares
    const numericString = currencyString.replace(/\D/g, '');

    // Converte a string numérica para um número de ponto flutuante
    return parseFloat(numericString) / 100;
}

// Função para formatar um número como moeda brasileira (R$)
function formatCurrency(value) {
    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2
    });
}

// Função para formatar um campo de entrada como moeda brasileira (R$)
function formatInputCurrency(input) {
    // Remove todos os caracteres não numéricos
    var value = input.value.replace(/\D/g, '');

    // Converta o valor em número
    var numericValue = parseFloat(value) / 100;

    // Formate o valor como moeda brasileira (R$) com separadores de milhares
    if (!isNaN(numericValue)) {
        input.value = formatCurrency(numericValue);
    }
}

// Calcular o custo total na carga da página
calcularCustoTotal();




// LUCRO FINAL ----------------------------------------------------------------------------------------------------
 

// VALOR VENDA - DEDUÇÕES - CUSTO TOTAL = LUCRO FINAL
function calcularLucroFinal() {
    const valorVendaInput = document.querySelector('.valorvenda');
    const deducoesInput = document.querySelector('.deducoes');
    const lucroFinalElement = document.getElementById('lucrofinal');

    // Obtém os valores formatados dos campos de entrada
    const valorVendaFormatted = valorVendaInput.value || '0'; // Se estiver vazio, considera como zero
    const deducoesFormatted = deducoesInput.value || '0'; // Se estiver vazio, considera como zero

    // Converte os valores formatados em números
    const valorVenda = parseCurrency(valorVendaFormatted);
    const deducoes = parseCurrency(deducoesFormatted);

    const lucroFinal = (valorVenda - deducoes - custoTotal).toFixed(2); // Inclui o custoTotal na fórmula e arredonda para 2 casas decimais

  
    // Adicione "R$" ao valor do lucro final
    lucroFinalElement.textContent ="R$ " + formatCurrency(lucroFinal);
}

// Eventos para calcular o custo total e o lucro final
document.querySelector('.valorpago').addEventListener('keyup', calcularCustoTotal);
document.querySelector('.custos').addEventListener('keyup', calcularCustoTotal);
document.querySelector('.valorvenda').addEventListener('keyup', calcularLucroFinal);
document.querySelector('.deducoes').addEventListener('keyup', calcularLucroFinal);

// Calcular o custo total na carga da página
calcularCustoTotal();

// Calcular o lucro final na carga da página
calcularLucroFinal();



// LUCRATIVIDADE TOTAL -------------------------------------------------------------------------------------

// Função para calcular a lucratividade total
function calcularLucratividadeTotal() {
    const lucroFinalElement = document.getElementById('lucrofinal');
    const custoTotalElement = document.getElementById('custototal');
    
    if (lucroFinalElement && custoTotalElement) {
        const lucroFinalText = lucroFinalElement.textContent;
        const custoTotalText = custoTotalElement.textContent;

        // Realiza o parse diretamente nas variáveis
        const lucroFinal = parseFloat(lucroFinalText.replace(/[^0-9.-]+/g,""));
        const custoTotal = parseFloat(custoTotalText.replace(/[^0-9.-]+/g,""));

        // Verifique se ambos lucroFinal e custoTotal são números válidos
        if (!isNaN(lucroFinal) && !isNaN(custoTotal)) {
            // Calcula a lucratividade total como uma porcentagem
            const lucratividadeTotalDecimal = (lucroFinal / custoTotal);
            const lucratividadeTotalPorcentagem = (lucratividadeTotalDecimal * 100).toFixed(2);

            // Verifica se a lucratividade é negativa e adiciona o sinal de "-"
            if (lucratividadeTotalDecimal < 0) {
                document.getElementById('lucratividadetotal').textContent = '-' + Math.abs(lucratividadeTotalPorcentagem) + '%';
            } else {
                document.getElementById('lucratividadetotal').textContent = lucratividadeTotalPorcentagem + '%';
            }
        } else {
            // Se um dos valores não for um número válido, exiba "0%"
            document.getElementById('lucratividadetotal').textContent = '0%';
        }
    } else {
        // Se os elementos não forem encontrados, exiba "0%"
        document.getElementById('lucratividadetotal').textContent = '0%';
    }
}


// Eventos para calcular o custo total e o lucro final quando os campos são atualizados
document.querySelector('.valorpago').addEventListener('keyup', calcularCustoTotal);
document.querySelector('.custos').addEventListener('keyup', calcularCustoTotal);
document.querySelector('.valorvenda').addEventListener('keyup', calcularLucroFinal);
document.querySelector('.deducoes').addEventListener('keyup', calcularLucroFinal);

// Chama a função para calcular o custo total na carga da página
calcularCustoTotal();

// Chama a função para calcular o lucro final na carga da página
calcularLucroFinal();

// Chama a função para calcular a lucratividade total na carga da página
calcularLucratividadeTotal();


//LUCRATIVIDADE EM DIAS ----------------------------------------------------------------------------
// Atualize o resultado de lucratividade a cada segundo
setInterval(function() {
    calcularResultadoDias();
}, 1000);

// Função para calcular e exibir a lucratividade em dias
function calcularResultadoDias() {
    // Obtenha os valores de lucratividadetotal e tempodias
    var lucratividadetotalElement = document.getElementById("lucratividadetotal");
    var tempodiasElement = document.getElementById("tempodias");

    var lucratividadetotal = parseFloat(lucratividadetotalElement.textContent) || 0;
    var tempodias = parseFloat(tempodiasElement.textContent.split(' ')[0]) || 0;

    // Calcule o resultado
    var resultadoDias = Math.pow(1 + lucratividadetotal, 1 / tempodias) - 1;

    // Exiba o resultado na célula com o ID "lucratividadedias"
    var lucratividadediasElement = document.getElementById("lucratividadedias");
    lucratividadediasElement.textContent = (resultadoDias * 100).toFixed(3) + '%'; // Ajuste o número de casas decimais conforme necessário
}

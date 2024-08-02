// Função para calcular a pontuação dos clubes com base no desempenho
function calcularPontuacao() {
    var tabela = document.getElementById("tabelaseriea");
    var linhas = tabela.querySelectorAll("tbody tr");

    // Itera sobre as linhas da tabela
    linhas.forEach(function(linha) {
        var vitorias = parseInt(linha.querySelector(".vitorias").textContent);
        var empates = parseInt(linha.querySelector(".empates").textContent);
        var derrotas = parseInt(linha.querySelector(".derrotas").textContent);
        
        //meucod, calcula a quantidade de partidas
        var partidasjogadas = vitorias + empates + derrotas;
        
        // Calcula a pontuação do clube com base no desempenho
        var pontos = (vitorias * 3) + empates;
        
        // Atualiza a pontuação na tabela
        linha.querySelector(".pontos").textContent = pontos;
        
        //meu cod, atualiza a quantidade de partidas
        linha.querySelector(".partidasjogadas").textContent = partidasjogadas;
    });
}

// Função para calcular o saldo de gols dos clubes
function calcularSaldoDeGols() {
    var tabela = document.getElementById("tabelaseriea");
    var linhas = tabela.querySelectorAll("tbody tr");

    // Itera sobre as linhas da tabela
    linhas.forEach(function(linha) {
        var golsMarcados = parseInt(linha.querySelector(".golsmarcados").textContent);
        var golsContra = parseInt(linha.querySelector(".golscontra").textContent);

        // Calcula o saldo de gols do clube
        var saldoGols = golsMarcados - golsContra;
        
        // Atualiza o saldo de gols na tabela
        linha.querySelector(".saldodegols").textContent = saldoGols;
    });
}

// Função para ordenar a tabela com base na pontuação, vitórias, saldo de gols e gols marcados dos clubes
function ordenarTabela() {
    var tabela = document.getElementById("tabelaseriea");
    var linhas = tabela.querySelectorAll("tbody tr");

    // Converte as linhas em um array para facilitar a classificação
    var linhasArray = Array.from(linhas);

    // Classifica as linhas com base na pontuação, vitórias, saldo de gols e gols marcados dos clubes
    linhasArray.sort(function(a, b) {
        var pontosA = parseInt(a.querySelector(".pontos").textContent);
        var pontosB = parseInt(b.querySelector(".pontos").textContent);
        
        if (pontosA !== pontosB) {
            return pontosB - pontosA; // Classifica em ordem decrescente de pontuação
        } else {
            var vitoriasA = parseInt(a.querySelector(".vitorias").textContent);
            var vitoriasB = parseInt(b.querySelector(".vitorias").textContent);
            
            if (vitoriasA !== vitoriasB) {
                return vitoriasB - vitoriasA; // Classifica em ordem decrescente de vitórias
            } else {
                var saldoGolsA = parseInt(a.querySelector(".saldodegols").textContent);
                var saldoGolsB = parseInt(b.querySelector(".saldodegols").textContent);
                
                if (saldoGolsA !== saldoGolsB) {
                    return saldoGolsB - saldoGolsA; // Classifica em ordem decrescente de saldo de gols
                } else {
                    var golsMarcadosA = parseInt(a.querySelector(".golsmarcados").textContent);
                    var golsMarcadosB = parseInt(b.querySelector(".golsmarcados").textContent);
                    
                    return golsMarcadosB - golsMarcadosA; // Classifica em ordem decrescente de gols marcados
                }
            }
        }
    });

    // Atualiza a posição dos clubes
    linhasArray.forEach(function(linha, index) {
        linha.querySelector(".posicao").textContent = index + 1;
    });

    // Adiciona as linhas classificadas de volta à tabela
    linhasArray.forEach(function(linha) {
        tabela.querySelector("tbody").appendChild(linha);
    });
}

// Função para qualificar as posições com cores
function qualificarPos() {
    var tabela = document.getElementById("tabelaseriea");
    var linhas = tabela.querySelectorAll("tbody tr");
    linhas.forEach(function(linha) {
        var clubPos = linha.querySelector("td.posicao");
        var clubPosNum = parseInt(clubPos.textContent);

        // Remove qualquer borda existente
        linha.style.borderLeft = "";

        // Adiciona a cor correta com base na posição
        if (clubPosNum >= 1 && clubPosNum <= 4) {
            clubPos.style.borderLeftColor = '#237AF5'; // Azul
        } else if (clubPosNum >= 5 && clubPosNum <= 6) {
            clubPos.style.borderLeftColor = '#FF8400'; // Laranja
        } else if (clubPosNum >= 7 && clubPosNum <= 12) {
            clubPos.style.borderLeftColor = '#2FA13A'; // Verde
        } else if (clubPosNum >= 17) {
            clubPos.style.borderLeftColor = '#FF0000'; // Vermelho
        }else{
          clubPos.style.border = 'none';
        }
    });
}

// Chama as funções para calcular a pontuação e o saldo de gols dos clubes
calcularPontuacao();
calcularSaldoDeGols();

// Chama a função para ordenar a tabela ao carregar a página
ordenarTabela();
qualificarPos();
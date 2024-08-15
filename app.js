const baseUrl = 'https://v3.football.api-sports.io/';
let infosTabela = {};

async function buscarInfo() {
    const ano = 2024;
    const params = {
        league: 71,
        season: ano,
    };
    const searchParams = new URLSearchParams(params);
    const endpoint = 'standings';
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'ba5b550c44c376c7cc5220e1777e1a18',
            'X-RapidAPI-Host': 'v3.football.api-sports.io',
        },
    };

    try {
        const response = await fetch(baseUrl + endpoint + '?' + searchParams, options);

        if (!response.ok) {
            throw new Error(`Erro: ${response.status} - ${response.statusText}`);
        }

        const responseData = await response.json();
        console.log('Resposta completa:', responseData);

        if (responseData.response && responseData.response.length > 0) {
            infosTabela = responseData.response[0].league.standings[0];
            console.log('Informações da Tabela:', infosTabela);
        } else {
            console.error('Dados não encontrados na resposta.');
        }
    } catch (error) {
        console.error('Erro ao buscar os dados:', error);
    }
}

buscarInfo();

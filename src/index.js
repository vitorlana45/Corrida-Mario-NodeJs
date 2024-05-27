const playersList = require("./personagens.js");



const readline = require('readline');
const { compileFunction } = require('vm');

// Função para criar uma interface de leitura
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (query) => {
    return new Promise(resolve => rl.question(query, resolve));
};

let player1;
let player2;

async function selectPlayerToRace() {

    player1 = await askQuestion("Digite o nome do primeiro personagem: ");
    player2 = await askQuestion("Digite o nome do segundo personagem: ");


    const existPlayer1 = playersList.find(p => p.NOME === player1);
    const existPlayer2 = playersList.find(p => p.NOME === player2);

    if (!existPlayer1 || !existPlayer2) {
        console.error("Jogador inexistente!");
        process.exit(1); // Sai do programa com erro
    } else {
        player1 = existPlayer1;
        player2 = existPlayer2;
        console.log(`🏁🚨 Corrida entre ${player1.NOME} e ${player2.NOME} começando...\n`);
        return playRaceEngine(player1, player2);
    }
}

async function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}

async function getRandomBlock() {
    let random = Math.random();
    let result

    switch (true) {
        case random < 0.33:
            result = "RETA";
            break;

        case random < 0.66:
            result = "CURVA";
            break;

        default:
            result = "CONFRONTO";
            break;
    }
    return result;
}


async function logRollResult(characterName, block, diceResult, attribute) {

    console.log(`${characterName} 🎲 rolou um dado de ${block} ${diceResult} + ${attribute} = ${diceResult + attribute}`)
}

async function playRaceEngine(character1, character2) {

    for (let round = 1; round <= 5; round++) {
        console.log(`🏁 Rodada ${round}`);

        // sorter bloco
        let block = await getRandomBlock();

        // Rolar os dados

        let diceResult1 = await rollDice();
        let diceResult2 = await rollDice();

        // teste de habilidade

        let totalTestSkill1 = 0;
        let totalTestSkill2 = 0;

        if (block === "RETA") {

            totalTestSkill1 = diceResult1 + character1.VELOCIDADE;
            totalTestSkill2 = diceResult2 + character2.VELOCIDADE;

            await logRollResult(character1.NOME, "Velocidade", diceResult1, character1.VELOCIDADE);
            await logRollResult(character2.NOME, "Velocidade", diceResult2, character2.VELOCIDADE);

        }
        if (block === "CURVA") {

            totalTestSkill1 = diceResult1 + character1.MANOBRABILIDADE;
            totalTestSkill2 = diceResult2 + character2.MANOBRABILIDADE;

            await logRollResult(character1.NOME, "Manobrabilidade", diceResult1, character1.MANOBRABILIDADE);
            await logRollResult(character2.NOME, "Manobrabilidade", diceResult2, character2.MANOBRABILIDADE);

        }
        if (block === "CONFRONTO") {

            let powerResult1 = diceResult1 + character1.PODER
            let powerResult2 = diceResult2 + character2.PODER

            console.log(`${character1.NOME} confrontou com ${character2.NOME}! 🥊`)

            await logRollResult(character1.NOME, "PODER", diceResult1, character1.PODER);
            await logRollResult(character2.NOME, "PODER", diceResult2, character2.PODER);

            if (powerResult1 > powerResult2 && character2.PONTOS > 0) {
                console.log(`${character1.NOME} venceu o confronto! ${character2.NOME} perdeu um ponto 🐢 `)
                character2.PONTOS--;
            }

            if (powerResult2 > powerResult1 && character1.PONTOS > 0) {
                console.log(`${character2.NOME} venceu o confronto! ${character1.NOME} perdeu um ponto 🐢 `)
                character1.PONTOS--;
            }


            console.log(powerResult2 === powerResult1 ? "Confronto empatado!" : "")
        }

        // verificando o vencedor
        if (totalTestSkill1 > totalTestSkill2) {
            console.log(`${character1.NOME} marcou um ponto!`)
            character1.PONTOS++;
        } else if (totalTestSkill2 > totalTestSkill1) {
            console.log(`${character2.NOME} marcou um ponto!`)
            character2.PONTOS++;
        }

        console.log("----------------------------")

    }
}

async function declareWinner(character1, character2) {

    console.log("Resultado final:");
    console.log(`${character1.NOME}: ${character1.PONTOS} ponto(s)`)

    console.log(`${character2.NOME}: ${character2.PONTOS} ponto(s)`)

    if (character1.PONTOS > character2.PONTOS){
        console.log(`\n${character1.NOME} venceu a corrida! 🏆`)
        process.exit(0)
    }
    else if (character2.PONTOS > character1.PONTOS){
        console.log(`\n${character2.NOME} venceu a corrida! 🏆`)
        process.exit(0)
    }
    else
        console.log(`\nA corrida terminou em empate!`)
        process.exit(0)
}
// função auto invocadvel
// sempre que escrever AWAIT, o fluxo so irá seguir depois que a função terminar de ser executada
(async function main() {

    console.log("Lista de players disponíveis para a corrida: \n")
    console.log(playersList)
    await selectPlayerToRace()
    await declareWinner(player1, player2);
})()
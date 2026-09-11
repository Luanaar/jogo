// Símbolos das cartas
const symbols = [
    "🎀",
    "🎀",
    "🌸",
    "🌸",
    "💖",
    "💖",
    "🦋",
    "🦋",
    "🌷",
    "🌷",
    "⭐",
    "⭐"
];

// Variáveis do jogo
let firstCard = null;
let secondCard = null;

let lockBoard = false;

let moves = 0;
let pairs = 0;


// Embaralha as cartas
function shuffle() {

    symbols.sort(() => Math.random() - 0.5);

}


// Cria o jogo
function createGame() {

    const game = document.getElementById("game");

    game.innerHTML = "";

    shuffle();

    for (let i = 0; i < symbols.length; i++) {

        const card = document.createElement("button");

        card.classList.add("card");

        card.innerText = "?";

        card.dataset.symbol = symbols[i];

        card.onclick = () => openCard(card);

        game.appendChild(card);
    }

}


// Abre uma carta
function openCard(card) {

    // Impede clicar em cartas durante a verificação
    if (lockBoard) {
        return;
    }

    // Impede clicar na mesma carta
    if (card === firstCard) {
        return;
    }

    // Impede clicar em uma carta já encontrada
    if (card.classList.contains("matched")) {
        return;
    }

    card.innerText = card.dataset.symbol;

    card.classList.add("open");

    // Primeira carta
    if (firstCard === null) {

        firstCard = card;

        return;
    }

    // Segunda carta
    secondCard = card;

    moves++;

    document.getElementById("moves").innerText = moves;

    checkCards();
}


// Verifica se as cartas são iguais
function checkCards() {

    const firstSymbol = firstCard.dataset.symbol;

    const secondSymbol = secondCard.dataset.symbol;

    if (firstSymbol === secondSymbol) {

        // Acertou
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");

        pairs++;

        document.getElementById("pairs").innerText = pairs;

        resetCards();

        // Verifica vitória
        if (pairs === 6) {

            winGame();

        }

    } else {

        // Errou
        lockBoard = true;

        setTimeout(() => {

            firstCard.innerText = "?";
            secondCard.innerText = "?";

            firstCard.classList.remove("open");
            secondCard.classList.remove("open");

            resetCards();

        }, 800);

    }

}


// Reseta as cartas selecionadas
function resetCards() {

    firstCard = null;
    secondCard = null;

    lockBoard = false;

}


// Quando o jogador ganha
function winGame() {

    const message = document.getElementById("message");

    message.innerText =
        `🎉 Parabéns! Você terminou em ${moves} jogadas!`;

    const name = prompt("Digite seu nome para entrar no ranking:");

    if (name) {

        saveScore(name, moves);

    }

}


// Reinicia o jogo
function restartGame() {

    moves = 0;
    pairs = 0;

    firstCard = null;
    secondCard = null;

    lockBoard = false;

    document.getElementById("moves").innerText = "0";

    document.getElementById("pairs").innerText = "0";

    document.getElementById("message").innerText = "";

    createGame();

}


// Envia a pontuação para o backend
async function saveScore(name, score) {

    await fetch("http://localhost:3000/ranking", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            name: name,
            score: score
        })

    });

    loadRanking();

}


// Busca o ranking no backend
async function loadRanking() {

    const response =
        await fetch("http://localhost:3000/ranking");

    const ranking = await response.json();

    const rankingElement =
        document.getElementById("ranking");

    rankingElement.innerHTML = "";

    ranking.forEach((player, index) => {

        const item = document.createElement("div");

        item.classList.add("ranking-item");

        item.innerText =
            `${index + 1}. ${player.name} - ${player.score} jogadas`;

        rankingElement.appendChild(item);

    });

}


// Começa o jogo
createGame();

loadRanking();

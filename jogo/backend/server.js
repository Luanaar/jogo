const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(cors());

// Procura o index.html uma pasta acima
app.use(express.static("../"));

function getRanking() {
    const data = fs.readFileSync("ranking.json", "utf8");
    return JSON.parse(data);
}

function saveRanking(ranking) {
    fs.writeFileSync(
        "ranking.json",
        JSON.stringify(ranking, null, 2)
    );
}

// Buscar ranking
app.get("/ranking", (req, res) => {

    const ranking = getRanking();

    ranking.sort((a, b) => a.score - b.score);

    res.json(ranking);
});

// Salvar pontuação
app.post("/ranking", (req, res) => {

    const { name, score } = req.body;

    if (!name || score === undefined) {
        return res.status(400).json({
            error: "Nome e pontuação são obrigatórios."
        });
    }

    const ranking = getRanking();

    ranking.push({
        name: name,
        score: Number(score)
    });

    saveRanking(ranking);

    res.json({
        message: "Pontuação salva com sucesso!"
    });
});

app.listen(PORT, () => {
    console.log(`Servidor funcionando em http://localhost:${PORT}`);
});



// Inicia o servidor
app.listen(PORT, () => {

    console.log(
        `Servidor funcionando em http://localhost:${PORT}`
    );

});

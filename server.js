const express = require ("express")
const sqlite3 = require ("sqlite3").verbose()
const cors = require ("cors")
const bcrypt = require ("bcrypt")

// Configurar servidor

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

// Criar banco sqlite

const db = new sqlite3.Database("./database.db")

// Criar tabela usuarios

db.run(`CREATE TABLE IF NOT EXIST usuarios()
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT
    email TEXT
    senha TEXT

)`)

// Cadastrar usuario

app.post("/usuario", async (rec, res) => {
    let nome = req.body.name
    let email = req.body.email
    let senha = req.body.senha

    let senhahash = await bcrypt.hash(senha, 10)
    console.log(senhahash);
    
    // Inserir no banco de dados

    db.run(`INSERT INTO usuarios{nome, email, senha} VALUES(?, ?, ?)`,
        [nome, email, senhahash],
        rec.json({
            id: this.lastID,
            nome,
            email
        })

    )


})


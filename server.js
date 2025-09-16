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

db.run(`CREATE TABLE IF NOT EXISTS usuarios(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    email TEXT,
    senha TEXT

)`)

// Cadastrar usuario

app.post("/usuarios", async (req, res) => {
    let nome = req.body.nome
    let email = req.body.email
    let senha = req.body.senha

    let senhahash = await bcrypt.hash(senha, 10)
    console.log(senhahash);
    
    // Inserir no banco de dados

    db.run(`INSERT INTO usuarios (nome, email, senha) VALUES(?, ?, ?)`,
        [nome, email, senhahash],
        res.json({
            id: this.lastID,
            nome,
            email,
            senha
        })

    )


})

// Listar todos os usuarios

app.get("/usuarios", (req, res) => {
    db.all(`SELECT id, nome, email FROM usuarios`, [], (err, rows) =>{
        res.json(rows)
    });
});

// Iniciar o servidor

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));

// Selecionar um usuário

app.get("/usuarios/:id", (req,res) => {
    let idUsuario = req.params.id;

    db.get(`SELECT id, nome, email FROM usuarios 
    WHERE id = ?`,
    [idUsuario], (err, row) => {
        if (row){
            res.json(row)
        } else{
            res.status(404).json({message : "Usuário não encontrado"})
        }
    })

})

app.delete("/usuarios/:id", (req, res) => {
    let idUsuario = req.params.id

    db.run(`DELETE FROM usuarios WHERE id = ?`,
    [idUsuario], function(){
        // Verifica se houve alteração no DB
        if(this.changes === 0){
            res.status(404).json({message : "Usuário não encontrado"})
        }

        res.json({message : "Usuário deletado"})

    })
})

app.delete("/usuarios", (req, res) => {
    db.run(`DELETE FROM usuarios`, function(err) {
        if (err) {
            return res.status(500).json({ message: "Erro ao deletar usuários" });
        }

        res.json({
            message: "Todos os usuários foram deletados",
            deletados: this.changes // número de linhas afetadas
        });
    });
});


const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Conectar ao banco de dados SQLite
const db = new sqlite3.Database('./estoque.db', (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
  }
  console.log('Conectado ao banco de dados SQLite.');
});

// Criar tabela de produtos (se não existir)
db.run(`
  CREATE TABLE IF NOT EXISTS produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    categoria TEXT NOT NULL,
    descricao TEXT,
    quantidade INTEGER NOT NULL,
    preco REAL NOT NULL,
    rua TEXT NOT NULL
  );
`);

// Rota para listar todos os produtos filtrando pela rua
app.get('/produtos/rua/:rua', (req, res) => {
  const rua = req.params.rua;
  db.all('SELECT * FROM produtos WHERE rua = ?', [rua], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Rota para gerar relatórios sobre o estado do estoque
app.get('/relatorios', (req, res) => {
  db.all('SELECT * FROM produtos WHERE quantidade < 5', (err, lowStock) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    db.all('SELECT * FROM produtos WHERE quantidade > 100', (err, highStock) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ lowStock, highStock });
    });
  });
});

// Rota para adicionar um produto
app.post('/produtos', (req, res) => {
  const { nome, categoria, descricao, quantidade, preco, rua } = req.body;
  db.run(
    'INSERT INTO produtos (nome, categoria, descricao, quantidade, preco, rua) VALUES (?, ?, ?, ?, ?, ?)',
    [nome, categoria, descricao, quantidade, preco, rua],
    function (err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    }
  );
});

// Rota para atualizar um produto
app.put('/produtos/:id', (req, res) => {
  const { id } = req.params;
  const { nome, categoria, descricao, quantidade, preco, rua } = req.body;
  db.run(
    'UPDATE produtos SET nome = ?, categoria = ?, descricao = ?, quantidade = ?, preco = ?, rua = ? WHERE id = ?',
    [nome, categoria, descricao, quantidade, preco, rua, id],
    function (err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ updated: this.changes });
    }
  );
});

// Rota para deletar um produto
app.delete('/produtos/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM produtos WHERE id = ?', id, function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ deleted: this.changes });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

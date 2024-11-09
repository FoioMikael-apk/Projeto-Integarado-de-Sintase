import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Produto from './components/Produto';
import { TextField, Button, Container, Typography, Box } from '@mui/material';

const App = () => {
  const [produtos, setProdutos] = useState([]);
  const [novoProduto, setNovoProduto] = useState({
    nome: '',
    descricao: '',
    quantidade: '',
    preco: '',
    rua: '',
    categoria: ''  // Campo de categoria
  });
  const [filtroRua, setFiltroRua] = useState('');
  const [relatorio, setRelatorio] = useState({ lowStock: [], highStock: [] });

  useEffect(() => {
    axios.get('http://localhost:5000/produtos').then((res) => setProdutos(res.data));
  }, []);

  // Função para adicionar um produto
  const adicionarProduto = () => {
    axios.post('http://localhost:5000/produtos', novoProduto).then(() => {
      setProdutos([...produtos, novoProduto]);
      setNovoProduto({ nome: '', descricao: '', quantidade: '', preco: '', rua: '', categoria: '' });
    });
  };

  // Função para deletar um produto
  const deletarProduto = (id) => {
    axios.delete(`http://localhost:5000/produtos/${id}`).then(() => {
      setProdutos(produtos.filter((produto) => produto.id !== id));
    });
  };

  // Função para atualizar um produto
  const atualizarProduto = (produtoAtualizado) => {
    axios.put(`http://localhost:5000/produtos/${produtoAtualizado.id}`, produtoAtualizado).then(() => {
      setProdutos(
        produtos.map((produto) => (produto.id === produtoAtualizado.id ? produtoAtualizado : produto))
      );
    });
  };

  // Função para filtrar por rua
  const filtrarPorRua = () => {
    axios.get(`http://localhost:5000/produtos/rua/${filtroRua}`).then((res) => setProdutos(res.data));
  };

  // Função para gerar relatórios (estoque baixo, excesso de estoque)
  const gerarRelatorio = () => {
    axios.get('http://localhost:5000/relatorios').then((res) => setRelatorio(res.data));
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '2em' }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Gerenciamento de Estoque
      </Typography>
      
      <Box component="form" noValidate autoComplete="off" style={{ marginBottom: '2em' }}>
        <TextField
          label="Nome"
          fullWidth
          margin="normal"
          value={novoProduto.nome}
          onChange={(e) => setNovoProduto({ ...novoProduto, nome: e.target.value })}
        />
        <TextField
          label="Descrição"
          fullWidth
          margin="normal"
          value={novoProduto.descricao}
          onChange={(e) => setNovoProduto({ ...novoProduto, descricao: e.target.value })}
        />
        <TextField
          label="Quantidade"
          type="number"
          fullWidth
          margin="normal"
          value={novoProduto.quantidade}
          onChange={(e) => setNovoProduto({ ...novoProduto, quantidade: e.target.value })}
        />
        <TextField
          label="Preço"
          type="number"
          fullWidth
          margin="normal"
          value={novoProduto.preco}
          onChange={(e) => setNovoProduto({ ...novoProduto, preco: e.target.value })}
        />
        <TextField
          label="Rua"
          fullWidth
          margin="normal"
          value={novoProduto.rua}
          onChange={(e) => setNovoProduto({ ...novoProduto, rua: e.target.value })}
        />
        <TextField
          label="Categoria"
          fullWidth
          margin="normal"
          value={novoProduto.categoria}
          onChange={(e) => setNovoProduto({ ...novoProduto, categoria: e.target.value })}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={adicionarProduto}
          style={{ marginTop: '1em' }}
        >
          Adicionar Produto
        </Button>
      </Box>
      
      <Box component="form" noValidate autoComplete="off" style={{ marginBottom: '2em' }}>
        <TextField
          label="Filtrar por Rua"
          fullWidth
          margin="normal"
          value={filtroRua}
          onChange={(e) => setFiltroRua(e.target.value)}
        />
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          onClick={filtrarPorRua}
          style={{ marginTop: '1em' }}
        >
          Filtrar
        </Button>
      </Box>

      <Button
        variant="outlined"
        color="secondary"
        fullWidth
        onClick={gerarRelatorio}
        style={{ marginTop: '1em' }}
      >
        Gerar Relatório
      </Button>

      <Box>
        {produtos.map((produto) => (
          <Produto
            key={produto.id}
            produto={produto}
            onDelete={deletarProduto}
            onUpdate={atualizarProduto}
          />
        ))}
      </Box>

      <Box>
        {relatorio.lowStock.length > 0 && (
          <div>
            <Typography variant="h6" gutterBottom>
              Relatório de Estoque
            </Typography>
            <Typography variant="body1">
              Produtos com Estoque Baixo:
              {relatorio.lowStock.map((produto) => (
                <div key={produto.id}>{produto.nome} - Quantidade: {produto.quantidade}</div>
              ))}
            </Typography>
          </div>
        )}
        {relatorio.highStock.length > 0 && (
          <div>
            <Typography variant="body1">
              Produtos com Excesso de Estoque:
              {relatorio.highStock.map((produto) => (
                <div key={produto.id}>{produto.nome} - Quantidade: {produto.quantidade}</div>
              ))}
            </Typography>
          </div>
        )}
      </Box>
    </Container>
  );
};

export default App;

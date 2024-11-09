import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';

const Produto = ({ produto, onDelete, onUpdate }) => (
  <Card variant="outlined" style={{ marginBottom: '1em' }}>
    <CardContent>
      <Typography variant="h6" component="div">
        {produto.nome || 'Sem nome'}
      </Typography>
      <Typography color="textSecondary">
        Descrição: {produto.descricao || 'Sem descrição'}
      </Typography>
      <Typography color="textSecondary">
        Quantidade: {produto.quantidade || 'N/D'}
      </Typography>
      <Typography color="textSecondary">
        Preço: R${produto.preco || '0,00'}
      </Typography>
      <Typography color="textSecondary">
        Rua: {produto.rua || 'Não especificada'}
      </Typography>
      <Typography color="textSecondary">
        Categoria: {produto.categoria || 'Sem categoria'} {/* Exibindo a categoria */}
      </Typography>
      <Box display="flex" justifyContent="space-between" marginTop="1em">
        <Button
          variant="contained"
          color="secondary"
          onClick={() => onDelete(produto.id)}
        >
          Deletar
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => onUpdate(produto)}
        >
          Atualizar
        </Button>
      </Box>
    </CardContent>
  </Card>
);

export default Produto;

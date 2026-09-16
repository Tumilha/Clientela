import express from 'express'
import cors from 'cors' 
import { PrismaClient } from './generated/prisma/index.js'

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

//ROTAS DE PRODUTOS

app.get('/products/:code', async (req, res) => {
  const { code } = req.params;
  try {
    let product;
    if (!isNaN(code)) {
      product = await prisma.produto.findUnique({
        where: {IdProduto: Number(code) },
      });
    } else {
      product = await prisma.produto.findUnique({
        where: { Codigo: code },
      });
    }
    if (product) {
      return res.json(product);
    } else {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao buscar o produto'});
  }  
});
// Cadastrar novo produto
app.post('/products', async (req, res) => {
  const { Codigo, NomeProduto, Preco, Tipo, Quantidade } = req.body;
  try {
    const novoProduto = await prisma.produto.create({
      data: { Codigo, NomeProduto, Preco, Tipo, Quantidade },
    });
    return res.status(201).json(novoProduto);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao cadastrar produto' });
  }
});

//ROTAS DE CLIENTES (Cadastro)

// Cadastrar cliente
app.post('/clients', async (req, res) => {
  const { CpfCliente, NomeCLiente, EmailCliente, TelefoneCliente } = req.body;
  try {
    const novoCliente = await prisma.cliente.create({
      data: { CpfCliente, NomeCLiente, EmailCliente, TelefoneCliente },
    });
    return res.status(201).json(novoCliente);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao cadastrar cliente (CPF já pode existir)' });
  }
});

// Buscar cliente por CPF
app.get('/clients/:cpf', async (req, res) => {
  const { cpf } = req.params;
  try {
    const cliente = await prisma.cliente.findUnique({
      where: { CpfCliente: cpf },
    });
    if (cliente) return res.json(cliente);
    return res.status(404).json({ error: 'Cliente não encontrado' });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar cliente' });
  }
});

//ROTAS DE FUNCIONÁRIOS (Login / Cadastro)

// Cadastrar funcionário
app.post('/employees', async (req, res) => {
  const { CpfFunc, NomeFunc, Cargo, Salario } = req.body;
  try {
    const novoFunc = await prisma.funcionario.create({
      data: { CpfFunc, NomeFunc, Cargo, Salario },
    });
    return res.status(201).json(novoFunc);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao cadastrar funcionário' });
  }
});

// Rota simples de "Login" do funcionário (verificando se o CPF existe)
app.post('/login', async (req, res) => {
  const { CpfFunc } = req.body;
  try {
    const funcionario = await prisma.funcionario.findUnique({
      where: { CpfFunc },
    });

    if (funcionario) {
      return res.json({ success: true, message: 'Login bem-sucedido', funcionario });
    } else {
      return res.status(401).json({ success: false, error: 'Funcionário não encontrado' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Erro no servidor ao tentar logar' });
  }
});

//ROTAS DE VENDAS

// Registrar uma venda fechada no caixa
app.post('/sales', async (req, res) => {
  const { CpfCliente, CpfFuncionario, itens } = req.body; 
  // O corpo da requisição deve enviar:
  // - CpfCliente (string)
  // - CpfFuncionario (string)
  // - itens: array de objetos [{ IdProduto: 1, Quantidade: 2, Preco: 10.00 }, ...]

  try {
    // Calcular o valor total da venda com base nos itens
    let ValorTotal = 0;
    itens.forEach(item => {
      ValorTotal += item.Preco * item.Quantidade;
    });

    // Criar a venda e registrar os itens de forma transacional (tudo junto)
    const novaVenda = await prisma.venda.create({
      data: {
        Data: new Date(), // Data atual
        ValorTotal: ValorTotal,
        CpfCliente: CpfCliente,
        CpfFuncionario: CpfFuncionario,
        // Usando o recurso de escrita relacional do Prisma para criar os itens junto:
        ItensVenda: {
          create: itens.map(item => ({
            IdProduto: item.IdProduto,
            Quantidade: item.Quantidade,
            Preco: item.Preco
          }))
        }
      },
      include: {
        ItensVenda: true // Retorna os itens salvos na resposta
      }
    });

    return res.status(201).json({ message: 'Venda finalizada com sucesso!', novaVenda });
  } catch (error) {
    console.error('Erro ao registrar venda:', error);
    return res.status(500).json({ error: 'Erro ao processar a venda no banco de dados' });
  }
});

// Inicializando o Servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor completo do caixa rodando na porta ${PORT} 🚀`);
});
const prisma = require("../prisma/client");

// 1. Busca todos os dados para o painel (produtos, vendas e estatísticas)
async function getDashboardData(req, res) {
  try {
    const produtos = await prisma.produto.findMany();
    const vendas = await prisma.venda.findMany({
      include: {
        ItensVenda: {
          include: {
            Produto: true
          }
        },
        Funcionario: true
      }
    });

    const valorEstoque = produtos.reduce((acc, p) => acc + (Number(p.Preco) * Number(p.Quantidade)), 0);
    const produtosEmFalta = produtos.filter(p => Number(p.Quantidade) <= 0).length;
    const totalVendas = vendas.length;

    return res.status(200).json({
      produtos,
      vendas,
      stats: {
        valorEstoque,
        produtosEmFalta,
        totalVendas
      }
    });
  } catch (error) {
    console.error("Erro ao carregar dados do admin:", error);
    return res.status(500).json({ error: "Erro interno ao carregar dados do painel." });
  }
}

// 2. Busca produto individual pelo Código ou IdProduto
async function getProductByCode(req, res) {
  try {
    const { code } = req.params;
    const numericCode = parseInt(code, 10);

    const produto = await prisma.produto.findFirst({
      where: {
        OR: [
          { Codigo: code },
          { IdProduto: isNaN(numericCode) ? undefined : numericCode }
        ].filter(Boolean)
      }
    });

    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado." });
    }

    return res.status(200).json(produto);
  } catch (error) {
    console.error("Erro ao buscar produto no admin:", error);
    return res.status(500).json({ error: "Erro ao buscar produto." });
  }
}

// 3. Exclui produto pelo IdProduto
async function deleteProduct(req, res) {
  try {
    const { id } = req.params;

    await prisma.produto.delete({
      where: { IdProduto: Number(id) }
    });

    return res.status(200).json({ message: "Produto excluído com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir produto no admin:", error);
    return res.status(500).json({ error: "Erro ao excluir produto." });
  }
}

// 4. Registra Venda de Produtos e atualiza Estoque no MySQL
async function registrarVenda(req, res) {
  try {
    const { items, cpfFunc, valorTotal } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Nenhum item na venda." });
    }

    // Busca o primeiro funcionário cadastrado no banco caso o CPF informado não exista
    let cpfValido = cpfFunc;
    const funcExistente = await prisma.funcionario.findFirst();

    if (!funcExistente) {
      return res.status(400).json({ error: "É necessário cadastrar ao menos um funcionário no banco antes de registrar vendas." });
    }

    if (cpfValido) {
      const verificaFunc = await prisma.funcionario.findUnique({
        where: { CpfFunc: cpfValido }
      });
      if (!verificaFunc) {
        cpfValido = funcExistente.CpfFunc;
      }
    } else {
      cpfValido = funcExistente.CpfFunc;
    }

    // Executa em transação para garantir integridade no banco
    const resultado = await prisma.$transaction(async (tx) => {
      // 1. Cria a venda principal no modelo Venda
      const novaVenda = await tx.venda.create({
        data: {
          Data: new Date(),
          ValorTotal: Number(valorTotal),
          CpfFuncionario: cpfValido
        }
      });

      // 2. Insere os itens na tabela ItemVenda e decrementa o estoque em Produto
      for (const item of items) {
        const qtdDesejada = Number(item.qtdDesejada || 1);

        await tx.itemVenda.create({
          data: {
            NotaFiscal: novaVenda.NotaFiscal,
            IdProduto: item.IdProduto,
            Quantidade: qtdDesejada,
            Preco: Number(item.Preco)
          }
        });

        await tx.produto.update({
          where: { IdProduto: item.IdProduto },
          data: {
            Quantidade: {
              decrement: qtdDesejada
            }
          }
        });
      }

      return novaVenda;
    });

    return res.status(201).json({ message: "Venda realizada com sucesso!", venda: resultado });
  } catch (error) {
    console.error("Erro ao registrar venda:", error);
    return res.status(500).json({ error: "Erro ao processar venda no banco." });
  }
}

module.exports = {
  getDashboardData,
  getProductByCode,
  deleteProduct,
  registrarVenda
};
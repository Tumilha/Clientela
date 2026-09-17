const prisma = require("../prisma/client");


//ADICIONAR PRODUTOS
async function create(req, res) {
  try {
    const { Codigo, NomeProduto, Preco, Quantidade } = req.body;

    const produto = await prisma.produto.create({
      data: {
        Codigo,
        NomeProduto,
        Preco,
        Quantidade
      }
    });

    res.status(201).json(produto);
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    res.status(500).json({ error: "Falha ao criar produto" });
  }
}

// LISTAR TODOS OS PRODUTOS
async function list(req, res) {
  try {
    const produto = await prisma.produto.findMany();

    res.status(200).json(produto);
  } catch (error) {
    console.error("Erro ao listar produto:", error);
    res.status(500).json({ error: "Falha ao listar produto" });
  }
}

// BUSCAR UM PRODUTOS
async function get(req, res) {
  try {
    const { idproduto } = req.params;

    const produto = await prisma.produto.findUnique({
      where: { idproduto: Number(idproduto) }
    });

    if (!produto) {
      return res.status(404).json({ error: "produto não encontrado" });
    }

    return res.status(200).json(produto);
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
    return res.status(500).json({ error: "Falha ao buscar produto" });
  }
}

// ATUALIZAR UM PRODUTOS
async function update(req, res) {
  try {
    const { idproduto } = req.params;
    const { Codigo, NomeProduto, Preco, Quantidade } = req.body;

    const produtoAtualizado = await prisma.produto.update({
      where: { idproduto: Number(idproduto) },
      data: {
        Codigo,
        NomeProduto,
        Preco,
        Quantidade
      }
    });

    res.status(200).json(produtoAtualizado);
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);

    if (error.code === "P2025") {
      return res.status(404).json({
        error: "produto não encontrado para atualizar"
      });
    }

    return res.status(500).json({
      error: "Falha ao atualizar produto"
    });
  }
}

// EXCLUIR UM PRODUTO
async function remove(req, res) {
  try {
    const { idproduto } = req.params;

    await prisma.produto.delete({
      where: { idproduto: Number(idproduto) }
    });

    res.status(200).json({
      message: "produto deletado com sucesso"
    });
  } catch (error) {
    console.error("Erro ao excluir produto:", error);

    if (error.code === "P2025") {
      return res.status(404).json({
        error: "produto não encontrado para deletar"
      });
    }

    return res.status(500).json({
      error: "Falha ao deletar produto"
    });
  }
}

module.exports = {
  create,
  list,
  get,
  update,
  remove
};
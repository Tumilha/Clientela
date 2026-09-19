const prisma = require("../prisma/client");

async function getProductByCode(req, res) {
  try {
    const { code } = req.params;

    // Busca no banco onde a coluna 'Codigo' é igual ao valor passado ('001')
    const produto = await prisma.produto.findFirst({
      where: {
        OR: [
          { Codigo: code },
          { IdProduto: isNaN(Number(code)) ? undefined : Number(code) }
        ].filter(Boolean)
      }
    });

    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado." });
    }

    // Retorna formatado exatamente com os nomes que o Caixa.jsx espera
    return res.status(200).json({
      code: produto.Codigo || String(produto.IdProduto),
      description: produto.NomeProduto,
      price: Number(produto.Preco)
    });

  } catch (error) {
    console.error("Erro ao buscar produto no Caixa:", error);
    return res.status(500).json({ error: "Erro interno no servidor ao buscar produto." });
  }
}

async function create(req, res) {
  try {
    return res.status(201).json({ message: "Caixa aberto com sucesso!" });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao abrir caixa." });
  }
}

async function login(req, res) {
  try {
    const { cpffunc } = req.body;
    const funcionario = await prisma.funcionario.findUnique({
      where: { CpfFunc: cpffunc }
    });

    if (!funcionario) {
      return res.status(401).json({ error: "Operador inválido." });
    }

    return res.status(200).json({ message: "Operador validado", funcionario });
  } catch (error) {
    return res.status(500).json({ error: "Erro interno ao validar operador." });
  }
}

module.exports = {
  getProductByCode,
  create,
  login
};
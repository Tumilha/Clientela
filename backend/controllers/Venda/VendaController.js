const prisma = require("../prisma/client");

//Listar todas as vendas
async function list(req, res) {
    try {
        const vendas = await prisma.venda.findMany({
            include: {CLiente: true, Funcionario: true, ItensVendas: true}
        });

        res.status(200).json(vendas);
    } catch (error) {
        console.error("Erro ao listar vendas:");
        res.status(500).json({ error:"Falha ao listar vendas"});
    }
}

//Buscar Venda
async function get(req, res) {
    try {
        const {notafiscal} = req.params;

        const venda = await prisma.venda.findUnique({
            where: {Notafiscal: Number(notafiscal)},
            include: {Cliente: true, Funcionario: true, ItensVendas: true}
        });

        if (!venda) {
            return res.status(404).json({error:"Venda não encontrada"})
        }
        return res.status(200).json(venda)
    } catch (error) {
        console.error("Erro ao buscar venda", error);
        return res.status(500).json({error: "Falha ao buscar venda"});
    }
}

//Criar Venda
async function create(req, res) {
    try {
        const {Data, ValorTotal, CpfCliente, CpfFuncionario} = req.body;

        const novaVenda = await prisma.venda.create({
            data: {
                Data: Data ? new Date(Data) : new Date(),
                ValorTotal,
                CpfCliente,
                CpfFuncionario
            }
        });
        return res.status(201).json(novaVenda);
    } catch (error) {
        console.error("Error ao criar venda", error);
        return res.status(500).json({error: "Falha ao criar venda"});
    }
}
// EXCLUIR/CANCELAR UMA VENDA
async function remove(req, res) {
  try {
    const { notafiscal } = req.params;

    await prisma.venda.delete({
      where: { NotaFiscal: Number(notafiscal) }
    });

    res.status(200).json({
      message: "Venda deletada com sucesso"
    });
  } catch (error) {
    console.error("Erro ao excluir venda:", error);

    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Venda não encontrada para deletar"
      });
    }

    return res.status(500).json({
      error: "Falha ao deletar venda"
    });
  }
}

module.exports = {
  list,
  get,
  create,
  remove
};
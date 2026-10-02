const prisma = require("../prisma/client");

// ADICIONAR FUNCIONÁRIO
async function create(req, res) {
  try {
    const { CpfFunc, NomeFunc, Cargo, Salario } = req.body;

    // Garante que o CPF contenha apenas dígitos
    const cpfLimpo = String(CpfFunc).replace(/\D/g, "");

    const funcionarioExistente = await prisma.funcionario.findUnique({
      where: { CpfFunc: cpfLimpo }
    });

    if (funcionarioExistente) {
      return res.status(400).json({ error: "Já existe um funcionário cadastrado com este CPF." });
    }

    const funcionario = await prisma.funcionario.create({
      data: {
        CpfFunc: cpfLimpo,
        NomeFunc,
        Cargo,
        Salario: Number(Salario)
      }
    });

    return res.status(201).json(funcionario);
  } catch (error) {
    console.error("Erro ao criar funcionário:", error);
    return res.status(500).json({ error: "Falha ao criar funcionário" });
  }
}

// LISTAR TODOS OS FUNCIONÁRIOS
async function list(req, res) {
  try {
    const funcionarios = await prisma.funcionario.findMany();
    return res.status(200).json(funcionarios);
  } catch (error) {
    console.error("Erro ao listar funcionários:", error);
    return res.status(500).json({ error: "Falha ao listar funcionários" });
  }
}

// BUSCAR UM FUNCIONÁRIO PELO CPF
async function get(req, res) {
  try {
    const { cpf } = req.params;
    const cpfLimpo = String(cpf).replace(/\D/g, "");

    const funcionario = await prisma.funcionario.findUnique({
      where: { CpfFunc: cpfLimpo }
    });

    if (!funcionario) {
      return res.status(404).json({ error: "Funcionário não encontrado." });
    }

    return res.status(200).json(funcionario);
  } catch (error) {
    console.error("Erro ao buscar funcionário:", error);
    return res.status(500).json({ error: "Falha ao buscar funcionário" });
  }
}

// ATUALIZAR UM FUNCIONÁRIO PELO CPF
async function update(req, res) {
  try {
    const { cpf } = req.params;
    const { NomeFunc, Cargo, Salario } = req.body;
    const cpfLimpo = String(cpf).replace(/\D/g, "");

    const funcionarioAtualizado = await prisma.funcionario.update({
      where: { CpfFunc: cpfLimpo },
      data: {
        NomeFunc,
        Cargo,
        Salario: Number(Salario)
      }
    });

    return res.status(200).json(funcionarioAtualizado);
  } catch (error) {
    console.error("Erro ao atualizar funcionário:", error);

    if (error.code === "P2025") {
      return res.status(404).json({ error: "Funcionário não encontrado para atualizar." });
    }

    return res.status(500).json({ error: "Falha ao atualizar funcionário" });
  }
}

// EXCLUIR UM FUNCIONÁRIO PELO CPF
async function remove(req, res) {
  try {
    const { cpf } = req.params;
    const cpfLimpo = String(cpf).replace(/\D/g, "");

    await prisma.funcionario.delete({
      where: { CpfFunc: cpfLimpo }
    });

    return res.status(200).json({ message: "Funcionário deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir funcionário:", error);

    if (error.code === "P2025") {
      return res.status(404).json({ error: "Funcionário não encontrado para deletar." });
    }

    return res.status(500).json({ error: "Falha ao deletar funcionário" });
  }
}

module.exports = {
  create,
  list,
  get,
  update,
  remove
};
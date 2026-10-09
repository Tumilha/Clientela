const prisma = require("../prisma/client");
const bcrypt = require("bcrypt");

function validarCPF(cpf) {
  cpf = cpf.replace(/\D/g, "");

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  let soma = 0;
  let resto;

  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;

  soma = 0;
  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11))) return false;

  return true;
}

// ADICIONAR FUNCIONÁRIO
async function create(req, res) {
  try {
    const { CpfFunc, NomeFunc, Cargo, Salario, Senha } = req.body;

    // Garante que o CPF contenha apenas dígitos
    const cpfLimpo = String(CpfFunc || "").replace(/\D/g, "");

    // 1. Validação se o CPF foi enviado e se é matematicamente válido
    if (!cpfLimpo || !validarCPF(cpfLimpo)) {
      return res.status(400).json({ error: "CPF inválido ou não informado." });
    }

    // 2. Validação se a senha foi enviada
    if (!Senha) {
      return res.status(400).json({ error: "A senha do funcionário é obrigatória." });
    }

    const funcionarioExistente = await prisma.funcionario.findUnique({
      where: { CpfFunc: cpfLimpo }
    });

    if (funcionarioExistente) {
      return res.status(400).json({ error: "Já existe um funcionário cadastrado com este CPF." });
    }

    //Criptografa a senha antes de salvar
    const senhaCriptografada = await bcrypt.hash(Senha, 10);

    const funcionario = await prisma.funcionario.create({
      data: {
        CpfFunc: cpfLimpo,
        NomeFunc,
        Cargo,
        Salario: Number(Salario),
        SenhaFunc: senhaCriptografada
      }
    });

    const { SenhaFunc, ...funcionarioSemSenha } = funcionario;

    return res.status(201).json(funcionarioSemSenha);
  } catch (error) {
    console.error("Erro ao criar funcionário:", error);
    return res.status(500).json({ error: "Falha ao criar funcionário" });
  }
}

// LISTAR TODOS OS FUNCIONÁRIOS
async function list(req, res) {
  try {
    const funcionarios = await prisma.funcionario.findMany();
    
    // Remove as senhas de todos os funcionários listados por segurança
    const funcionariosSemSenha = funcionarios.map(({ SenhaFunc, ...func }) => func);

    return res.status(200).json(funcionariosSemSenha);
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
    //Remove a senha antes de retornar
    const { SenhaFunc, ...funcionarioSemSenha } = funcionario;

    return res.status(200).json(funcionarioSemSenha);
  } catch (error) {
    console.error("Erro ao buscar funcionário:", error);
    return res.status(500).json({ error: "Falha ao buscar funcionário" });
  }
}

// ATUALIZAR UM FUNCIONÁRIO PELO CPF
async function update(req, res) {
  try {
    const { cpf } = req.params;
    const { NomeFunc, Cargo, Salario, Senha } = req.body;
    const cpfLimpo = String(cpf).replace(/\D/g, "");

    const dadosAtualizacao = {
      NomeFunc,
      Cargo,
      Salario: Number(Salario)
    };

    // Se o usuário mandou uma nova senha na atualização, nós a criptografamos também
    if (Senha) {
      dadosAtualizacao.SenhaFunc = await bcrypt.hash(Senha, 10);
    }

    const funcionarioAtualizado = await prisma.funcionario.update({
      where: { CpfFunc: cpfLimpo },
      data: dadosAtualizacao
    });

    // Remove a senha antes de retornar
    const { SenhaFunc, ...funcionarioSemSenha } = funcionarioAtualizado;

    return res.status(200).json(funcionarioSemSenha);
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
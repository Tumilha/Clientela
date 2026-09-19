// controllers/Login/LoginController.js
const prisma = require("../../prisma/client");

async function login(req, res) {
  try {
    const { cpffunc } = req.body;

    if (!cpffunc) {
      return res.status(400).json({ error: "O CPF do funcionário é obrigatório." });
    }

    const cpfApenasNumeros = cpffunc.replace(/\D/g, "");

    // Tenta buscar no model Funcionario
    const funcionario = await prisma.funcionario.findUnique({
      where: { CpfFunc: cpfApenasNumeros }
    });

    if (!funcionario) {
      return res.status(401).json({ error: "Funcionário não encontrado / CPF inválido" });
    }

    return res.status(200).json({
      message: "Login realizado com sucesso",
      funcionario
    });
  } catch (error) {
    console.error("Erro ao realizar login:", error);
    // Retorna a mensagem real do erro para podermos ver exatamente o que falhou
    return res.status(500).json({ 
      error: "Falha ao realizar login no servidor.",
      detalhes: error.message 
    });
  }
}

module.exports = {
  login
};
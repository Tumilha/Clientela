// controllers/Login/LoginController.js
const prisma = require("../../prisma/client");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "Clientela";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "Cliente";

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

    const payload = {
      cpf: funcionario.CpfFunc,
      nome: funcionario.NomeFunc,
      cargo: funcionario.Cargo
    }
    
    // Gera o token JWT com validade de 1 hora
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "15m"});
    const refreshToken = jwt.sign({ cpf: funcionario.CpfFunc }, REFRESH_SECRET, { expiresIn: "7d" });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV == "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      message: "Login realizado com sucesso",
      token,
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
// controllers/Login/LoginController.js
const prisma = require("../../prisma/client");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const JWT_SECRET = process.env.JWT_SECRET || "Clientela";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "Cliente";

function validarCPF(cpf) {
  // Correção 1: Adicionado o ponto em .replace
  cpf = String(cpf || "").replace(/\D/g, "");

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  let soma = 0;
  let resto;

  // Validação do 1º Dígito Verificador
  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;

  soma = 0;
  // Validação do 2º Dígito Verificador (multiplicador correto vai até 11)
  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11))) return false;

  return true;
}

async function login(req, res) {
  try {
    const { cpffunc, senha } = req.body;

    if (!cpffunc || !senha) {
      return res.status(400).json({ error: "O CPF do funcionário é obrigatório." });
    }

    const cpfApenasNumeros = cpffunc.replace(/\D/g, "");

    if (!validarCPF(cpfApenasNumeros)) {
      return res.status(400).json({ error: "CPF inválido (digitos verificadores incorretos)."});
    }

    // Tenta buscar no model Funcionario
    const funcionario = await prisma.funcionario.findUnique({
      where: { CpfFunc: cpfApenasNumeros }
    });

    if (!funcionario) {
      return res.status(401).json({ error: "Funcionário não encontrado / CPF inválido" });
    }

    const senhaCorreta = await bcrypt.compare(senha, funcionario.SenhaFunc);

    if (!senhaCorreta) {
      return res.status(401).json({ error: "Senha incorreta."});
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

    const { SenhaFunc, ...funcionarioSemSenha } = funcionario;

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
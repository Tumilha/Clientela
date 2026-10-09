import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";

const estadoInicial = {
  cpffunc: "",
  senha: "",
};

//Função de formatação do CPF
function formatarCPF(valor) {
  return valor
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function Login({ onLogin }) {
  const [credenciais, setCredenciais] = useState(estadoInicial);
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  const navigate = useNavigate();

  function atualizarCampo(campo, valor) {
    setCredenciais((atual) => ({ ...atual, [campo]: valor }));
  }

  //Função que formata o CPF na hora
  function handleCPFChange(evento) {
    atualizarCampo("cpffunc", formatarCPF(evento.target.value));
  }

  async function handleSubmit(evento) {
    evento.preventDefault();
    setErro("");

    // Remove espaços e garante que envia limpo
    const cpfLimpo = credenciais.cpffunc.trim();
    const senhaLimpa = credenciais.senha.trim();

    if (!cpfLimpo || !senhaLimpa) {
      setErro("Preencha o CPF e a senha do funcionário.");
      return;
    }

    try {
      setEnviando(true);

      const resposta = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ cpffunc: cpfLimpo, senha: senhaLimpa }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.error || "Erro ao realizar login.");
      }

      // Salva o Token JWT e os dados do funcionário no sessionStorage
      sessionStorage.setItem("token", dados.token);
      sessionStorage.setItem("funcionario_logado", JSON.stringify(dados.funcionario));

      if (onLogin) {
        await onLogin(dados.funcionario);
      }

      setCredenciais(estadoInicial);

      navigate("/caixa")

    } catch (err) {
      setErro(err.message || "Não foi possível conectar ao servidor.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="login-fundo">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1 className="login-titulo">Acesso ao Sistema</h1>

        {erro && <p className="login-erro">{erro}</p>}

        <div className="login-campo">
          <label htmlFor="cpffunc">CPF do Funcionário</label>
          <input
            id="cpffunc"
            type="text"
            placeholder="Digite o CPF (apenas números)"
            value={credenciais.cpffunc}
            onChange={handleCPFChange}
          />
        </div>

        <div className="login-campo">
          <label htmlFor="senha">Senha</label>
          <input 
          id="senha"
          type="password"
          placeholder="Digite sua senha"
          value={credenciais.senha}
          onChange={(e) => atualizarCampo("senha", e.target.value)} 
          />
        </div>

        <button type="submit" className="login-botao" disabled={enviando}>
          {enviando ? "Entrando..." : "Entrar"}
        </button>

        <div>
          <p>Ainda não é cadastrado?</p>
          <Link to='/funcionario' className="link-criar-conta">
            Cadastrar novo Funcionário
          </Link>
        </div>

        <p className="login-rodape"> 🌀 Clientela</p>
      </form>
    </div>
  );
}

export default Login;
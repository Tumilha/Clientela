import { useState } from "react";
import "./login.css";

const estadoInicial = {
  cpffunc: "",
};

function Login({ onLogin }) {
  const [credenciais, setCredenciais] = useState(estadoInicial);
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  function atualizarCampo(campo, valor) {
    setCredenciais((atual) => ({ ...atual, [campo]: valor }));
  }

  async function handleSubmit(evento) {
    evento.preventDefault();
    setErro("");

    const cpfLimpo = credenciais.cpffunc.trim();

    if (!cpfLimpo) {
      setErro("Preencha o CPF do funcionário.");
      return;
    }

    try {
      setEnviando(true);

      // Fazendo a requisição real para o back-end Node.js
      const resposta = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cpffunc: cpfLimpo }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.error || "Erro ao realizar login.");
      }

      // Salva os dados do funcionário retornado pelo banco no localStorage
      localStorage.setItem("funcionario_logado", JSON.stringify(dados.funcionario));

      // Se houver uma função passada via props, executa
      if (onLogin) {
        await onLogin(dados.funcionario);
      }

      setCredenciais(estadoInicial);
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
            onChange={(e) => atualizarCampo("cpffunc", e.target.value)}
          />
        </div>

        <button type="submit" className="login-botao" disabled={enviando}>
          {enviando ? "Entrando..." : "Entrar"}
        </button>

        <p className="login-rodape"> 🌀 Clientela</p>
      </form>
    </div>
  );
}

export default Login;
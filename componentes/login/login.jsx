import { useState } from "react";
import "./login.css";

const estadoInicial = {
  usuario: "",
  email: "",
  senha: "",
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

    const usuarioLimpo = credenciais.usuario.trim();
    const emailLimpo = credenciais.email.trim();
    const senhaLimpa = credenciais.senha.trim();

    // 1. Validação de campos obrigatórios
    if (!usuarioLimpo || !emailLimpo || !senhaLimpa) {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }

    // 2. Validação básica de formato de e-mail
    if (!emailLimpo.includes("@") || !emailLimpo.includes(".")) {
      setErro("Informe um e-mail válido.");
      return;
    }

    try {
      setEnviando(true);

      const dadosUsuario = {
        usuario: usuarioLimpo,
        email: emailLimpo,
      };

      // Salva a sessão no LocalStorage
      localStorage.setItem("usuario_logado", JSON.stringify(dadosUsuario));

      // Se houver prop enviada pelo componente pai (ex: redirecionar de tela)
      if (onLogin) {
        await onLogin(dadosUsuario);
      }

      setCredenciais(estadoInicial);
    } catch (err) {
      setErro("Não foi possível realizar o login. Tente novamente.");
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
          <label htmlFor="usuario">Nome de Usuário</label>
          <input
            id="usuario"
            type="text"
            placeholder="Digite seu nome de usuário"
            value={credenciais.usuario}
            onChange={(e) => atualizarCampo("usuario", e.target.value)}
          />
        </div>

        <div className="login-campo">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            placeholder="Digite seu e-mail"
            value={credenciais.email}
            onChange={(e) => atualizarCampo("email", e.target.value)}
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

        <p className="login-rodape">🌀 Clientela</p>
      </form>
    </div>
  );
}

export default Login;
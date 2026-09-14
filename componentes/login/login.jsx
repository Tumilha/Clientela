import React, { useState } from 'react';
import './login.css';

function Login() {
  const [usuario, setUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
  
    console.log('Dados enviados:', { usuario, email, senha });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-titulo">Acesso ao Sistema</h1>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="usuario">Nome de Usuário</label>
            <input
              type="text"
              id="usuario"
              placeholder="Digite seu nome de usuário"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              id="senha"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-button">
            Entrar
          </button>
        </form>

        <span className="login-footer">🌀 Clientela</span>
      </div>
    </div>
  );
}

export default Login;
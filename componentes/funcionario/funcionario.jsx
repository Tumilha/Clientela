import { useState } from "react";
import "./funcionario.css";

const estadoInicial = {
  cpffunc: "",
  nomefunc: "",
  cargo: "",
  salario: "",
};

function formatarMoeda(valorDigitado) {
  const digitos = valorDigitado.replace(/\D/g, "");
  const numero = Number(digitos || "0") / 100;
  return numero.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function salarioParaNumero(salarioFormatado) {
  const apenasNumerosEVirgula = salarioFormatado
    .replace(/\s/g, "")
    .replace(/[^0-9,]/g, "")
    .replace(",", ".");
    
  return Number(apenasNumerosEVirgula || 0);
}

function formatarCPF(valor) {
  return valor
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function CadastroFuncionario({ onCadastrar }) {
  const [funcionario, setFuncionario] = useState(estadoInicial);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [enviando, setEnviando] = useState(false);

  function atualizarCampo(campo, valor) {
    setFuncionario((atual) => ({ ...atual, [campo]: valor }));
  }

  function handleCPFChange(evento) {
    atualizarCampo("cpffunc", formatarCPF(evento.target.value));
  }

  function handleSalarioChange(evento) {
    atualizarCampo("salario", formatarMoeda(evento.target.value));
  }

  async function handleSubmit(evento) {
    evento.preventDefault();
    setErro("");
    setSucesso("");

    // Limpa pontuações do CPF para salvar apenas os 11 números no banco
    const cpfApenasNumeros = funcionario.cpffunc.replace(/\D/g, "");
    const nomeLimpo = funcionario.nomefunc.trim();
    const cargoLimpo = funcionario.cargo.trim();

    if (!cpfApenasNumeros || cpfApenasNumeros.length !== 11) {
      setErro("Informe um CPF válido de 11 dígitos.");
      return;
    }

    if (!nomeLimpo || !cargoLimpo) {
      setErro("Preencha o Nome e o Cargo do funcionário.");
      return;
    }

    const salarioNumerico = salarioParaNumero(funcionario.salario);
    if (!salarioNumerico || salarioNumerico <= 0) {
      setErro("Informe um salário válido.");
      return;
    }

    try {
      setEnviando(true);

      const response = await fetch("http://localhost:3000/funcionarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          CpfFunc: cpfApenasNumeros,
          NomeFunc: nomeLimpo,
          Cargo: cargoLimpo,
          Salario: salarioNumerico,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Falha ao cadastrar funcionário");
      }

      if (onCadastrar) {
        await onCadastrar(data);
      }

      setSucesso("Funcionário cadastrado com sucesso!");
      setFuncionario(estadoInicial);
    } catch (err) {
      setErro(err.message || "Não foi possível cadastrar o funcionário.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="cadastro-fundo">
      <form className="cadastro-card" onSubmit={handleSubmit}>
        <h1 className="cadastro-titulo">Cadastro de Funcionário</h1>

        {erro && <p className="cadastro-erro">{erro}</p>}
        {sucesso && <p className="cadastro-sucesso" style={{ color: "green", marginBottom: "10px" }}>{sucesso}</p>}

        <div className="cadastro-campo">
          <label htmlFor="cpffunc">CPF</label>
          <input
            id="cpffunc"
            type="text"
            placeholder="000.000.000-00"
            value={funcionario.cpffunc}
            onChange={handleCPFChange}
          />
        </div>

        <div className="cadastro-campo">
          <label htmlFor="nomefunc">Nome Completo</label>
          <input
            id="nomefunc"
            type="text"
            placeholder="Digite o nome completo"
            value={funcionario.nomefunc}
            onChange={(e) => atualizarCampo("nomefunc", e.target.value)}
          />
        </div>

        <div className="cadastro-campo">
          <label htmlFor="cargo">Cargo</label>
          <input
            id="cargo"
            type="text"
            placeholder="Ex: Caixa, Gerente..."
            value={funcionario.cargo}
            onChange={(e) => atualizarCampo("cargo", e.target.value)}
          />
        </div>

        <div className="cadastro-campo">
          <label htmlFor="salario">Salário</label>
          <input
            id="salario"
            type="text"
            inputMode="numeric"
            placeholder="R$ 0,00"
            value={funcionario.salario}
            onChange={handleSalarioChange}
          />
        </div>

        <button type="submit" className="cadastro-botao" disabled={enviando}>
          {enviando ? "Cadastrando..." : "Cadastrar"}
        </button>

        <p className="cadastro-rodape">Sistema Clientela</p>
      </form>
    </div>
  );
}

export default CadastroFuncionario;
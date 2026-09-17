import { useState } from "react";
import "./Cadastro.css";

const estadoInicial = {
  codigo: "",
  nome: "",
  preco: "",
  quantidade: "",
};

// Converte o que o usuário digita em uma máscara de moeda BRL (R$ 0,00)
function formatarMoeda(valorDigitado) {
  const digitos = valorDigitado.replace(/\D/g, "");
  const numero = Number(digitos || "0") / 100;
  return numero.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

// Transforma "R$ 1.234,56" em 1234.56 (número puro)
function precoParaNumero(precoFormatado) {
  const apenasNumerosEVirgula = precoFormatado
    .replace(/\s/g, "")
    .replace(/[^0-9,]/g, "")
    .replace(",", ".");
    
  return Number(apenasNumerosEVirgula || 0);
}

function Cadastro({ onCadastrar }) {
  const [produto, setProduto] = useState(estadoInicial);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [enviando, setEnviando] = useState(false);

  function atualizarCampo(campo, valor) {
    setProduto((atual) => ({ ...atual, [campo]: valor }));
  }

  function handlePrecoChange(evento) {
    atualizarCampo("preco", formatarMoeda(evento.target.value));
  }

  function handleQuantidadeChange(evento) {
    const apenasNumeros = evento.target.value.replace(/\D/g, "");
    atualizarCampo("quantidade", apenasNumeros);
  }

  async function handleSubmit(evento) {
  evento.preventDefault();
  setErro("");
  setSucesso("");

  const codigoLimpo = produto.codigo.trim();
  const nomeLimpo = produto.nome.trim();

  if (!codigoLimpo || !nomeLimpo) {
    setErro("Preencha o código e o nome do produto.");
    return;
  }

  const precoNumerico = precoParaNumero(produto.preco);
  if (!precoNumerico || precoNumerico <= 0) {
    setErro("Informe um preço válido.");
    return;
  }

  try {
    setEnviando(true);

    const response = await fetch("http://localhost:3000/produtos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Codigo: codigoLimpo,
        NomeProduto: nomeLimpo,
        Preco: precoNumerico,
        Quantidade: Number(produto.quantidade || 0)
      })
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Falha ao cadastrar produto");
    }

    const produtoCriado = await response.json();

    if (onCadastrar) {
      await onCadastrar(produtoCriado);
    }

    setSucesso("Produto cadastrado com sucesso!");
    setProduto(estadoInicial);
  } catch (err) {
    setErro(err.message || "Não foi possível cadastrar o produto. Tente novamente.");
  } finally {
    setEnviando(false);
  }
}

  return (
    <div className="cadastro-fundo">
      <form className="cadastro-card" onSubmit={handleSubmit}>
        <h1 className="cadastro-titulo">Cadastro de Produto</h1>

        {erro && <p className="cadastro-erro">{erro}</p>}
        {sucesso && <p className="cadastro-sucesso" style={{ color: "green", marginBottom: "10px" }}>{sucesso}</p>}

        <div className="cadastro-campo">
          <label htmlFor="codigo">Código</label>
          <input
            id="codigo"
            type="text"
            placeholder="Digite o código"
            value={produto.codigo}
            onChange={(e) => atualizarCampo("codigo", e.target.value)}
          />
        </div>

        <div className="cadastro-campo">
          <label htmlFor="nome">Nome do Produto</label>
          <input
            id="nome"
            type="text"
            placeholder="Digite o nome"
            value={produto.nome}
            onChange={(e) => atualizarCampo("nome", e.target.value)}
          />
        </div>

        <div className="cadastro-campo">
          <label htmlFor="preco">Preço</label>
          <input
            id="preco"
            type="text"
            inputMode="numeric"
            placeholder="R$ 0,00"
            value={produto.preco}
            onChange={handlePrecoChange}
          />
        </div>

        <div className="cadastro-campo">
          <label htmlFor="quantidade">Quantidade</label>
          <input
            id="quantidade"
            type="text"
            inputMode="numeric"
            placeholder="0"
            value={produto.quantidade}
            onChange={handleQuantidadeChange}
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

export default Cadastro;
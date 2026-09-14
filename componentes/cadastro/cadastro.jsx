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

// Transforma "R$ 1.234,56" em 1234.56 (número puro, pronto pro backend)
function precoParaNumero(precoFormatado) {
  const limpo = precoFormatado.replace(/[^\d,]/g, "").replace(",", ".");
  return Number(limpo || 0);
}

function Cadastro({ onCadastrar }) {
  const [produto, setProduto] = useState(estadoInicial);
  const [erro, setErro] = useState("");
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

    if (!produto.codigo.trim() || !produto.nome.trim()) {
      setErro("Preencha o código e o nome do produto.");
      return;
    }

    const precoNumerico = precoParaNumero(produto.preco);
    if (!precoNumerico) {
      setErro("Informe um preço válido.");
      return;
    }

    const novoProduto = {
      codigo: produto.codigo.trim(),
      nome: produto.nome.trim(),
      preco: precoNumerico,
      quantidade: Number(produto.quantidade || 0),
    };

    try {
      setEnviando(true);

      if (onCadastrar) {
        // Passe essa prop em <Cadastro onCadastrar={...} /> se quiser
        // controlar o envio a partir de um componente pai (ex: Admin.jsx)
        await onCadastrar(novoProduto);
      } else {
        // TODO: troque pela rota real do seu backend (ex: POST /produtos)
        await fetch("/api/produtos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(novoProduto),
        });
      }

      setProduto(estadoInicial);
    } catch (err) {
      setErro("Não foi possível cadastrar o produto. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="cadastro-fundo">
      <form className="cadastro-card" onSubmit={handleSubmit}>
        <h1 className="cadastro-titulo">cadastro de Produto</h1>

        {erro && <p className="cadastro-erro">{erro}</p>}

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
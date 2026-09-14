import { useState, useEffect } from "react";
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
  const [produtosCadastrados, setProdutosCadastrados] = useState([]);

  // Carrega os produtos salvos no localStorage assim que a tela abre
  useEffect(() => {
    const salvos = localStorage.getItem("produtos_clientela");
    if (salvos) {
      try {
        setProdutosCadastrados(JSON.parse(salvos));
      } catch (err) {
        console.error("Erro ao ler produtos do localStorage", err);
      }
    }
  }, []);

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

    // 1. Validação de campos obrigatórios
    if (!codigoLimpo || !nomeLimpo) {
      setErro("Preencha o código e o nome do produto.");
      return;
    }

    // 2. Validação de PREÇO
    const precoNumerico = precoParaNumero(produto.preco);
    if (!precoNumerico || precoNumerico <= 0) {
      setErro("Informe um preço válido.");
      return;
    }

    // 3. Validação de CÓDIGO DUPLICADO
    const codigoExiste = produtosCadastrados.some(
      (p) => p.code.toLowerCase() === codigoLimpo.toLowerCase()
    );

    if (codigoExiste) {
      setErro(`Já existe um produto cadastrado com o código "${codigoLimpo}".`);
      return;
    }

    const novoProduto = {
      id: Date.now(),
      code: codigoLimpo,
      description: nomeLimpo,
      price: precoNumerico,
      quantity: Number(produto.quantidade || 0),
    };

    try {
      setEnviando(true);

      // Atualiza a lista local e salva no LocalStorage do navegador
      const novaLista = [...produtosCadastrados, novoProduto];
      setProdutosCadastrados(novaLista);
      localStorage.setItem("produtos_clientela", JSON.stringify(novaLista));

      // Se houver prop passada pelo componente pai, avisa ele também
      if (onCadastrar) {
        await onCadastrar(novoProduto);
      }

      setSucesso("Produto cadastrado com sucesso!");
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
import { useState, useRef, useEffect, useCallback } from 'react';
import './Caixa.css';

function Caixa() {
  const [code, setCode] = useState('');
  const [currentProduct, setCurrentProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [receivedAmount, setReceivedAmount] = useState(0);
  const inputRef = useRef(null);

  // Mantém o input sempre focado
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const change = receivedAmount > subtotal ? receivedAmount - subtotal : 0;

  // Funções de Ações / Atalhos
  const handleNovaVenda = useCallback(() => {
    if (window.confirm('Deseja iniciar uma nova venda?')) {
      setCart([]);
      setCurrentProduct(null);
      setReceivedAmount(0);
      setCode('');
    }
  }, []);

  const handleExcluirItem = useCallback(() => {
    if (cart.length === 0) {
      alert('Não há itens no carrinho para excluir.');
      return;
    }
    setCart((prevCart) => {
      const updated = [...prevCart];
      updated.pop(); // Remove o último item adicionado (poderia ser por índice selecionado)
      if (updated.length === 0) setCurrentProduct(null);
      return updated;
    });
  }, [cart.length]);

  const handleFinalizarVenda = useCallback(() => {
    if (cart.length === 0) {
      alert('O carrinho está vazio.');
      return;
    }
    const valorPago = prompt(`Subtotal: R$ ${subtotal.toFixed(2)}. Digite o valor recebido:`, subtotal.toFixed(2));
    if (valorPago !== null) {
      const pago = parseFloat(valorPago.replace(',', '.'));
      if (isNaN(pago) || pago < subtotal) {
        alert('Valor recebido inválido ou insuficiente!');
      } else {
        setReceivedAmount(pago);
        alert(`Venda finalizada com sucesso! Troco: R$ ${(pago - subtotal).toFixed(2)}`);
        // Limpa para a próxima venda
        setCart([]);
        setCurrentProduct(null);
        setReceivedAmount(0);
      }
    }
  }, [cart.length, subtotal]);

  // Listener global para os Atalhos de Teclado (F-keys)
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // Previne o comportamento padrão do navegador para as teclas de função (ex: F5 atualizar a página)
      if (['F2', 'F3', 'F5', 'F6', 'F9', 'F11'].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case 'F2':
        case 'Ctrl': // focar no input
          inputRef.current?.focus();
          break;
        case 'F3':
          alert('Funcionalidade de Pesquisa de Produtos (Abra seu modal aqui)');
          break;
        case 'F5':
          handleExcluirItem();
          break;
        case 'F6':
          alert('Funcionalidade de Alterar Quantidade');
          break;
        case 'F9':
          handleNovaVenda();
          break;
        case 'F11':
          handleFinalizarVenda();
          break;
        case 'Escape':
          setCode('');
          setCurrentProduct(null);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [handleExcluirItem, handleNovaVenda, handleFinalizarVenda]);

  // Adicionar produto via Enter no Input
  const handleKeyDownInput = async (e) => {
    if (e.key === 'Enter' && code.trim() !== '') {
      try {
        const response = await fetch(`http://localhost:3000/products/${code}`);
        if (response.ok) {
          const product = await response.json();
          setCurrentProduct(product);

          setCart((prevCart) => {
            const existingIndex = prevCart.findIndex((item) => item.code === product.code);
            if (existingIndex >= 0) {
              const updated = [...prevCart];
              updated[existingIndex].quantity += 1;
              return updated;
            }
            return [...prevCart, { ...product, id: Date.now(), quantity: 1 }];
          });

          setCode('');
        } else {
          alert('Produto não encontrado!');
          setCode('');
        }
      } catch (err) {
        console.error('Erro na requisição ao backend', err);
        alert('Erro ao conectar com o servidor.');
      }
    }
  };

  return (
    <div className="pdv-wrapper">
      <div className="pdv-container">
        
        {/* Cabeçalho */}
        <header className="header">
          <div className="logo">
            <span className="logo-icon">🌀</span>
            <span className="logo-text">clientela</span>
          </div>
        </header>

        {/* Conteúdo Principal */}
        <div className="main-content">
          
          {/* PAINEL ESQUERDO */}
          <div className="left-panel">
            <div className="status-box">CAIXA ABERTO</div>

            <div className="product-image-box">
              <svg viewBox="0 0 24 24" width="80" height="80" fill="#92a0b3">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
            </div>

            <div className="field-group">
              <label>CÓDIGO</label>
              <input
                ref={inputRef}
                type="text"
                className="code-input"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={handleKeyDownInput}
              />
            </div>

            <div className="info-row">
              <span>VALOR UNITÁRIO</span>
              <strong>R$ {currentProduct ? currentProduct.price.toFixed(2).replace('.', ',') : '0,00'}</strong>
            </div>

            <div className="info-row">
              <span>TOTAL ITEM</span>
              <strong>R$ {currentProduct ? (currentProduct.price * (cart.find(i => i.code === currentProduct.code)?.quantity || 1)).toFixed(2).replace('.', ',') : '0,00'}</strong>
            </div>

            {/* Grid de Atalhos (Agora clicáveis também!) */}
            <div className="shortcuts-grid">
              <button onClick={() => inputRef.current?.focus()}>F2 Código</button>
              <button onClick={() => alert('Pesquisa')}>F3 Pesquisa</button>
              <button onClick={() => alert('CPF na Nota')}>CS/F11 CPF</button>
              <button onClick={handleExcluirItem}>F5 Excluir</button>
              <button onClick={() => alert('Alterar Qtd')}>F6 Alterar</button>
              <button onClick={() => alert('Produto')}>Ctrl+R Produto</button>
              <button onClick={handleNovaVenda}>F9 Nova</button>
              <button onClick={handleFinalizarVenda}>F11 Venda</button>
              <button onClick={() => { setCode(''); setCurrentProduct(null); }}>ESC Sair</button>
            </div>
          </div>

          {/* PAINEL DIREITO */}
          <div className="right-panel">
            <div className="table-header-title">LISTA DE PRODUTOS</div>

            <div className="table-container">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Código</th>
                    <th>Descrição</th>
                    <th>Qtd</th>
                    <th>Vl.Unit</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                        Nenhum produto lançado
                      </td>
                    </tr>
                  ) : (
                    cart.map((item, index) => (
                      <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>{item.code}</td>
                        <td>{item.description}</td>
                        <td>{item.quantity}</td>
                        <td>{item.price.toFixed(2).replace('.', ',')}</td>
                        <td>{(item.price * item.quantity).toFixed(2).replace('.', ',')}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer de Totais */}
            <div className="totals-footer">
              <div className="total-box">
                <span className="total-label">TOTAL RECEBIDO</span>
                <span className="total-value">R$ {receivedAmount.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="total-box">
                <span className="total-label">TROCO</span>
                <span className="total-value">R$ {change.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="total-box subtotal-box">
                <span className="total-label">SUBTOTAL</span>
                <span className="total-value">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Caixa;
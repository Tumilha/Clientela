import { useState, useRef, useEffect } from 'react';
import './Caixa.css';

function Caixa() {

  const [code, setCode] = useState('');
  const [currentProduct, setCurrentProduct] = useState(null);
  const [cart, setCart] = useState([
    { id: 1, code: '789', description: 'ARROZ TIPO 1', quantity: 1, price: 22.00 },
    { id: 2, code: '4567', description: 'REFRIGERANTE 2L', quantity: 2, price: 8.90 },
    { id: 3, code: '8652', description: 'BISCOITO CHOCOLATE', quantity: 3, price: 4.50 },
    { id: 4, code: '9753', description: 'LEITE INTEGRAL', quantity: 5, price: 5.00 },
    { id: 5, code: '2011', description: 'CAFÉ 500G', quantity: 1, price: 12.00 },
  ]);

  const [receivedAmount, setReceivedAmount] = useState(110.45);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const change = receivedAmount > subtotal ? receivedAmount - subtotal : 0;

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter' && code) {
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
        }
      } catch (err) {
        console.error('Erro na requisição ao backend', err);
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
                onKeyDown={handleKeyDown}
              />
            </div>

            <div className="info-row">
              <span>VALOR UNITÁRIO</span>
              <strong>R$ {currentProduct ? currentProduct.price.toFixed(2).replace('.', ',') : '0,00'}</strong>
            </div>

            <div className="info-row">
              <span>TOTAL ITEM</span>
              <strong>R$ {currentProduct ? currentProduct.price.toFixed(2).replace('.', ',') : '0,00'}</strong>
            </div>

            {/* Grid de Atalhos */}
            <div className="shortcuts-grid">
              <button>F2 Código</button>
              <button>F3 Pesquisa</button>
              <button>CS/F11 CPF</button>
              <button>F5 Excluir</button>
              <button>F6 Alterar</button>
              <button>Ctrl+R Produto</button>
              <button>F9 Nova</button>
              <button>F11 Venda</button>
              <button>ESC Sair</button>
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
                  {cart.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.code}</td>
                      <td>{item.description}</td>
                      <td>{item.quantity}</td>
                      <td>{item.price.toFixed(2).replace('.', ',')}</td>
                      <td>{(item.price * item.quantity).toFixed(2).replace('.', ',')}</td>
                    </tr>
                  ))}
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
                <span className="total-value">{subtotal.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
    );
}

export default Caixa;
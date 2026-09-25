import { useState, useEffect, useRef, useCallback } from 'react';
import './admin.css';

function Admin() {
  const [products, setProducts] = useState([]);
  const [code, setCode] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [qtdDesejada, setQtdDesejada] = useState(1); // Quantidade selecionada para venda
  const [stats, setStats] = useState({
    valorEstoque: 0,
    produtosEmFalta: 0,
    totalVendas: 0
  });

  const inputRef = useRef(null);

  // 1. Busca todos os dados do banco MySQL ao carregar a página
  const loadDashboardData = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3000/admin/dashboard');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.produtos || []);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar dados do Admin:', error);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
    inputRef.current?.focus();
  }, [loadDashboardData]);

  // 2. Busca produto individual pelo Código ao dar Enter (acumula a quantidade se for o mesmo)
  const handleKeyDownInput = async (e) => {
    if (e.key === 'Enter' && code.trim() !== '') {
      const cleanCode = code.trim().split(':')[0];

      try {
        const response = await fetch(`http://localhost:3000/admin/produto/${cleanCode}`);
        if (response.ok) {
          const product = await response.json();
          
          if (selectedProduct && selectedProduct.IdProduto === product.IdProduto) {
            // Se for o mesmo produto já selecionado, incrementa a quantidade
            setQtdDesejada(prev => prev + 1);
          } else {
            setSelectedProduct(product);
            setQtdDesejada(1);
          }
        } else {
          alert('Produto não encontrado!');
          setSelectedProduct(null);
          setQtdDesejada(1);
        }
      } catch (err) {
        console.error('Erro na requisição:', err);
        alert('Erro ao conectar com o servidor.');
      }
    }
  };

  // 3. Efetuar Venda no Banco (F11)
  const handleEfetuarVenda = useCallback(async () => {
    if (!selectedProduct) {
      alert('Selecione um produto para efetuar a venda!');
      return;
    }

    const valorTotalVenda = Number(selectedProduct.Preco) * qtdDesejada;

    if (window.confirm(`Confirmar venda de ${qtdDesejada}x ${selectedProduct.NomeProduto} por R$ ${valorTotalVenda.toFixed(2).replace('.', ',')}?`)) {
      try {
        const response = await fetch('http://localhost:3000/admin/venda', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            items: [
              {
                IdProduto: selectedProduct.IdProduto,
                Preco: selectedProduct.Preco,
                qtdDesejada: qtdDesejada
              }
            ],
            valorTotal: valorTotalVenda,
            cpfFunc: '00000000000'
          })
        });

        if (response.ok) {
          alert('Venda registrada e estoque atualizado com sucesso!');
          setSelectedProduct(null);
          setCode('');
          setQtdDesejada(1);
          loadDashboardData(); // Recarrega dashboard e tabela com o estoque atualizado
        } else {
          const errData = await response.json();
          alert(`Erro ao registrar venda: ${errData.error || 'Erro desconhecido'}`);
        }
      } catch (err) {
        console.error('Erro ao conectar para venda:', err);
        alert('Erro ao conectar com o servidor.');
      }
    }
  }, [selectedProduct, qtdDesejada, loadDashboardData]);

  // 4. Excluir Produto do Cadastro (F5)
  const handleExcluirProduto = useCallback(async () => {
    if (!selectedProduct) {
      alert('Selecione ou busque um produto primeiro para excluir.');
      return;
    }

    if (window.confirm(`Tem certeza que deseja excluir o produto ${selectedProduct.NomeProduto}?`)) {
      try {
        const response = await fetch(`http://localhost:3000/admin/produto/${selectedProduct.IdProduto}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          alert('Produto excluído com sucesso!');
          setSelectedProduct(null);
          setCode('');
          setQtdDesejada(1);
          loadDashboardData();
        } else {
          alert('Erro ao excluir o produto.');
        }
      } catch (err) {
        console.error('Erro ao excluir produto:', err);
        alert('Erro ao conectar com o servidor.');
      }
    }
  }, [selectedProduct, loadDashboardData]);

  // 5. Atalhos globais de teclado
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (['F2', 'F3', 'F5', 'F6', 'F9', 'F11'].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case 'F2':
          inputRef.current?.focus();
          break;
        case 'F3':
          loadDashboardData();
          break;
        case 'F5':
          handleExcluirProduto();
          break;
        case 'F11':
          handleEfetuarVenda();
          break;
        case 'Escape':
          setCode('');
          setSelectedProduct(null);
          setQtdDesejada(1);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [handleExcluirProduto, handleEfetuarVenda, loadDashboardData]);

  // Cálculo dinâmico do TOTAL ITEM
  const totalCalculado = selectedProduct ? (Number(selectedProduct.Preco) * qtdDesejada) : 0;

  return (
    <div className="admin-page">
      <div className="admin-container">

        {/* CABEÇALHO */}
        <header className="admin-header">
          <div className="logo">
            <span className="logo-icon">🌀</span>
            <span className="logo-text">clientela</span>
          </div>
        </header>

        <div className="admin-content">

          {/* PAINEL ESQUERDO */}
          <aside className="admin-sidebar">

            <div className="admin-title">
              REGISTROS ADMINISTRATIVOS
              <div className="admin-icon">
                <svg xmlns="http://www.w3.org/2000/svg" height="80" viewBox="0 0 24 24" width="80" fill="currentColor">
                  <path d="M19.43 12.98c.04-.32.07-.65.07-.98s-.02-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.37-.31-.6-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98L14.5 2.42C14.47 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.5.42L9.12 5.07c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.08-.48 0-.6.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.08.65-.08.98s.03.66.08.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.37.31.6.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.38-2.65c.61-.25 1.17-.58 1.69-.98l2.49 1c.23.08.48 0 .6-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5A3.5 3.5 0 1 1 12 8a3.5 3.5 0 0 1 0 7.5z" />
                </svg>
              </div>
            </div>

            <div className="field-group">
              <label>CÓDIGO</label>
              <input
                ref={inputRef}
                className="code-input"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={handleKeyDownInput}
              />
            </div>

            <div className="info-row">
              <span>VALOR UNITÁRIO</span>
              <strong>
                R$ {selectedProduct ? Number(selectedProduct.Preco).toFixed(2).replace('.', ',') : '0,00'}
              </strong>
            </div>

            <div className="info-row">
              <span>QUANTIDADE</span>
              <strong>
                {selectedProduct ? `${qtdDesejada} un` : '0 un'}
              </strong>
            </div>

            <div className="info-row">
              <span>TOTAL ITEM</span>
              <strong>
                R$ {totalCalculado.toFixed(2).replace('.', ',')}
              </strong>
            </div>

            {/* ATALHOS */}
            <div className="admin-shortcuts">
              <button onClick={() => inputRef.current?.focus()}>F2 Código</button>
              <button onClick={loadDashboardData}>F3 Pesquisa</button>
              <button onClick={() => alert('CPF')}>Ctrl+P CPF</button>

              <button onClick={handleExcluirProduto}>F5 Excluir</button>
              <button onClick={() => alert('Alterar')}>F6 Alterar</button>
              <button onClick={() => alert('Produto')}>Ctrl+R Produto</button>

              <button onClick={() => { setCode(''); setSelectedProduct(null); setQtdDesejada(1); }}>F9 Nova</button>
              <button onClick={handleEfetuarVenda}>F11 Venda</button>
              <button onClick={() => { setCode(''); setSelectedProduct(null); setQtdDesejada(1); }}>ESC Sair</button>
            </div>

          </aside>

          {/* PAINEL DIREITO */}
          <main className="admin-main">

            <div className="products-title">
              LISTA DE PRODUTOS
            </div>

            <div className="products-table-container">

              <table className="products-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Código</th>
                    <th>Descrição</th>
                    <th>Qtd Estoque</th>
                    <th>Vl.Unit</th>
                    <th>Total Estoque</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                        Nenhum produto cadastrado no banco de dados.
                      </td>
                    </tr>
                  ) : (
                    products.map((item, index) => (
                      <tr
                        key={item.IdProduto || index}
                        onClick={() => {
                          if (selectedProduct?.IdProduto === item.IdProduto) {
                            setQtdDesejada(prev => prev + 1);
                          } else {
                            setSelectedProduct(item);
                            setQtdDesejada(1);
                          }
                          setCode(String(item.Codigo || item.IdProduto));
                        }}
                        style={{
                          backgroundColor: selectedProduct?.IdProduto === item.IdProduto ? 'rgba(0, 0, 0, 0.08)' : 'transparent',
                          cursor: 'pointer'
                        }}
                      >
                        <td>{index + 1}</td>
                        <td>{item.Codigo || item.IdProduto}</td>
                        <td>{item.NomeProduto}</td>
                        <td>{item.Quantidade}</td>
                        <td>{Number(item.Preco).toFixed(2).replace('.', ',')}</td>
                        <td>{(Number(item.Preco) * Number(item.Quantidade)).toFixed(2).replace('.', ',')}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

            </div>

            {/* INDICADORES */}
            <div className="admin-stats">

              <div className="stat-box">
                <span>VALOR TOTAL DO ESTOQUE</span>
                <strong>R$ {stats.valorEstoque.toFixed(2).replace('.', ',')}</strong>
              </div>

              <div className="stat-box">
                <span>PRODUTOS EM FALTA</span>
                <strong>{stats.produtosEmFalta}</strong>
              </div>

              <div className="stat-box">
                <span>TOTAL DE VENDAS</span>
                <strong>{stats.totalVendas}</strong>
              </div>

            </div>

          </main>

        </div>

      </div>

    </div>
  );
}

export default Admin;
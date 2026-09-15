import './admin.css';

function Admin() {
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
                        </div>

                        <div className="admin-icon">
                            <svg viewBox="0 0 24 24" width="80" height="80" fill="#92a0b3">
                                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
                            </svg>
                        </div>

                        <div className="field-group">
                            <label>CÓDIGO</label>
                            <input className="code-input" />
                        </div>
                        <div className="info-row">
                            <span>VALOR UNITÁRIO</span>
                            <strong>R$ </strong>
                        </div>

                        <div className="info-row">
                            <span>TOTAL ITEM</span>
                            <strong>R$ </strong>
                        </div>

                        {/* ATALHOS */}
                        <div className="admin-shortcuts">

                            <button>F2 Código</button>
                            <button>F3 Pesquisa</button>
                            <button>Ctrl+P CPF</button>

                            <button>F5 Excluir</button>
                            <button>F6 Alterar</button>
                            <button>Ctrl+R Produto</button>

                            <button>F9 Nova</button>
                            <button>F11 Venda</button>
                            <button>ESC Sair</button>

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
                                        <th>Qtd</th>
                                        <th>Vl.Unit</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr key="1">
                                    <td>1</td>
                                    <td>1</td>
                                    <td>a</td>
                                    <td>10</td>
                                    <td>10</td>
                                    <td>100</td>
                                    </tr>
                                
                                </tbody>
                            </table>

                        </div>

                        {/* INDICADORES */}
                        <div className="admin-stats">

                            <div className="stat-box">
                                <span>VALOR TOTAL DO ESTOQUE</span>
                                <strong>1</strong>
                            </div>

                            <div className="stat-box">
                                <span>PRODUTOS EM FALTA</span>
                                <strong>1</strong>
                            </div>

                            <div className="stat-box">
                                <span>TOTAL DE VENDAS</span>
                                <strong>1</strong>
                            </div>

                        </div>

                    </main>

                </div>

            </div>

        </div>
    );
}

export default Admin;
const sellers = [
  { id: 's1', name: 'Vanessa', sales: 28, goal: 40, active: true, pending: 6 },
  { id: 's2', name: 'Juliana', sales: 22, goal: 35, active: true, pending: 8 },
  { id: 's3', name: 'Patrícia', sales: 17, goal: 30, active: false, pending: 10 },
];

function AdminPage() {
  return (
    <div className="page-grid">
      <div className="panel">
        <h2>Painel Administrativo</h2>
        <div className="metric-card">
          <h3>Visão Geral</h3>
          <p>Acompanhe vendedores, metas e possibilidade de intervenção nas conversas.</p>
        </div>
        <div className="metric-card" style={{ marginTop: '1rem' }}>
          <h3>Vendedores cadastrados</h3>
          <table className="seller-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Vendas</th>
                <th>Meta</th>
                <th>Ativo</th>
                <th>Conversas pendentes</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map((seller) => (
                <tr key={seller.id}>
                  <td>{seller.name}</td>
                  <td>{seller.sales}</td>
                  <td>{seller.goal}</td>
                  <td>{seller.active ? 'Sim' : 'Não'}</td>
                  <td>{seller.pending}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;

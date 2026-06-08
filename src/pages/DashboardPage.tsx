import { PageHeader } from '../components/PageHeader';

const dashboardMetrics = [
  { label: 'Vendas do mês', value: 'R$ 28.420', delta: '+18%' },
  { label: 'Clientes ativos', value: '5', delta: '+3' },
  { label: 'Taxa de retorno', value: '62%', delta: '+4%' },
  { label: 'Satisfação', value: '4.8/5', delta: '+0.2' },
];

const temperatureItems = [
  { label: 'Quente', color: '#ef4444', count: 2, percent: 40 },
  { label: 'Morno', color: '#f59e0b', count: 2, percent: 40 },
  { label: 'Frio', color: '#3b82f6', count: 1, percent: 20 },
];

const tagItems = [
  { label: 'Follow-up', color: '#fb7185', count: 2 },
  { label: 'Promoção', color: '#22c55e', count: 2 },
  { label: 'VIP', color: '#8b5cf6', count: 1 },
  { label: 'Nova cliente', color: '#0ea5e9', count: 1 },
  { label: 'Recuperar', color: '#f59e0b', count: 1 },
];

function DashboardPage() {
  return (
    <div className="page-panel">
      <PageHeader
        title="Dashboard"
        subtitle="Tenha uma visão rápida da performance de vendas, clientes e etiquetas mais usadas."
      />

      <div className="kpi-grid">
        {dashboardMetrics.map((metric) => (
          <div key={metric.label} className="kpi-card">
            <span>{metric.label}</span>
            <div className="kpi-value">{metric.value} <span className="kpi-delta">{metric.delta}</span></div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="chart-card">
          <div className="chart-title">Distribuição de temperatura</div>
          <div className="chart-list">
            {temperatureItems.map((item) => (
              <div key={item.label} className="chart-row">
                <div className="chart-row-label">
                  <span className="chart-dot" style={{ background: item.color }} />
                  {item.label}
                </div>
                <div className="chart-row-progress">
                  <div className="chart-progress-bg">
                    <div className="chart-progress-fill" style={{ width: `${item.percent}%`, background: item.color }} />
                  </div>
                </div>
                <span>{item.count} ({item.percent}%)</span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-title">Etiquetas mais usadas</div>
          <div className="chart-list">
            {tagItems.map((item) => (
              <div key={item.label} className="chart-row">
                <div className="chart-row-label">
                  <span className="chart-dot" style={{ background: item.color }} />
                  {item.label}
                </div>
                <div className="chart-row-progress">
                  <div className="chart-progress-bg">
                    <div className="chart-progress-fill" style={{ width: `${item.count * 20}%`, background: item.color }} />
                  </div>
                </div>
                <span>{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;

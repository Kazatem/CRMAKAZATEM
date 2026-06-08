import { PageHeader } from '../components/PageHeader';

const campaignItems = [
  { id: 'm1', title: 'Reativar clientes frias', subtitle: 'Último envio: ontem · 142 destinatárias', status: 'Automático' },
  { id: 'm2', title: 'Quentes sem resposta há 2h', subtitle: 'Próximo envio em 12 minutos · 8 destinatárias', status: 'Automático' },
  { id: 'm3', title: 'Promoção da semana - mornas', subtitle: 'Agendado para sexta, 09:00 · 67 destinatárias', status: 'Agendado' },
  { id: 'm4', title: 'Lançamento coleção verão', subtitle: 'Agendado para 15/10, 10:00 · 312 destinatárias', status: 'Agendado' },
];

function MessagingPage() {
  return (
    <div className="page-panel">
      <PageHeader
        title="Disparos de mensagem"
        subtitle="Gerencie campanhas, aberturas e sugestões de IA para retomar conversas."
        actionLabel="+ Nova campanha"
      />

      <div className="kpi-grid">
        <div className="kpi-card">
          <span>Enviados hoje</span>
          <div className="kpi-value">248 <span className="kpi-delta">+12%</span></div>
        </div>
        <div className="kpi-card">
          <span>Taxa de abertura</span>
          <div className="kpi-value">74% <span className="kpi-delta">+5%</span></div>
        </div>
        <div className="kpi-card">
          <span>Respostas</span>
          <div className="kpi-value">41 <span className="kpi-delta">+8%</span></div>
        </div>
      </div>

      <div className="suggestion-banner">
        <div>
          <div className="suggestion-title">Sugestão da IA</div>
          <div className="suggestion-pill">DISPARO AGORA</div>
        </div>
        <p>Identifiquei 8 clientes quentes sem resposta há 2h. Sugiro um disparo com um lembrete amigável + oferta de pagamento facilitado.</p>
        <blockquote>“Oi! Vi que você tava interessada ❤️ Ainda dá tempo de fechar com pix com 5% off ou em até 3x sem juros. Posso reservar?”</blockquote>
        <div className="suggestion-actions">
          <button className="primary-button">Disparar agora</button>
          <button className="secondary-button">Agendar</button>
          <button className="secondary-button">Editar texto</button>
        </div>
      </div>

      <div className="campaign-list">
        {campaignItems.map((item) => (
          <div key={item.id} className="campaign-card">
            <div>
              <div className="campaign-title">{item.title}</div>
              <div className="campaign-subtitle">{item.subtitle}</div>
            </div>
            <span className={`status-pill status-${item.status.toLowerCase()}`}>{item.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MessagingPage;

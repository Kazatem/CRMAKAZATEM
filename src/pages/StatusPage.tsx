import { PageHeader } from '../components/PageHeader';

const statusCards = [
  { id: 's1', title: 'Coleção primavera chegou!', views: 1248, reach: 78 },
  { id: 's2', title: 'Promoção relâmpago -30%', views: 932, reach: 64 },
  { id: 's3', title: 'Look do dia: midi floral', views: 780, reach: 52 },
  { id: 's4', title: 'Frete grátis até domingo', views: 603, reach: 47 },
];

function StatusPage() {
  return (
    <div className="page-panel status-page">
      <PageHeader
        title="Postar status"
        subtitle="Crie conteúdos rápidos para WhatsApp e Instagram com sugestões da IA."
      />
      <div className="status-grid">
        <div className="status-builder card-panel">
          <div className="section-head">
            <h3>Nova publicação</h3>
          </div>
          <div className="card-panel-body">
            <label className="field-label">Criar novo status</label>
            <textarea className="status-input" placeholder="✨ Novidades chegando! Quem vai garantir os primeiros looks da coleção?" rows={5} />

            <div className="suggestion-box">
              <div className="suggestion-badge">Sugestão da IA para mais vendas</div>
              <p className="suggestion-text">“Meninas, último dia da pré-venda com 20% off 🛍️ Comenta 'EU QUERO' que te mando os looks separados pelo seu estilo ✨”</p>
            </div>

            <div className="status-channels">
              <button className="channel-button active">WhatsApp Status</button>
              <button className="channel-button">Instagram Story</button>
            </div>

            <div className="status-actions">
              <button className="primary-button">Publicar agora</button>
              <button className="secondary-button">Agendar</button>
            </div>
          </div>
        </div>

        <div className="status-preview card-panel">
          <div className="section-head">
            <h3>Últimos status publicados</h3>
          </div>
          <div className="status-cards">
            {statusCards.map((card) => (
              <div key={card.id} className="status-card">
                <div className="status-card-image">📷</div>
                <div className="status-card-content">
                  <strong>{card.title}</strong>
                  <span>{card.views} visualizações</span>
                  <div className="status-progress">
                    <div className="status-progress-fill" style={{ width: `${card.reach}%` }} />
                  </div>
                  <span className="status-progress-label">{card.reach}% de alcance</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatusPage;

import { PageHeader } from '../components/PageHeader';

const funnelColumns = [
  { id: 'new', title: 'Novo contato', total: 3, value: 'R$ 330' },
  { id: 'interested', title: 'Interessada', total: 1, value: 'R$ 260' },
  { id: 'proposal', title: 'Proposta enviada', total: 1, value: 'R$ 480' },
  { id: 'closed', title: 'Fechado', total: 0, value: 'R$ 0' },
];

const funnelCards = [
  {
    id: 'p1',
    stage: 'new',
    name: 'Patrícia Mendes',
    value: 'R$ 150',
    tags: ['Morno', 'Nova cliente'],
  },
  {
    id: 'p2',
    stage: 'new',
    name: 'Carla Souza',
    value: 'R$ 180',
    tags: ['Morno', 'Promoção'],
  },
  {
    id: 'p3',
    stage: 'new',
    name: 'Renata Lima',
    value: 'R$ 0',
    tags: ['Frio', 'Recuperar'],
  },
  {
    id: 'p4',
    stage: 'interested',
    name: 'Juliana Almeida',
    value: 'R$ 260',
    tags: ['Quente', 'Promoção', 'Follow-up'],
  },
  {
    id: 'p5',
    stage: 'proposal',
    name: 'Mariana Costa',
    value: 'R$ 480',
    tags: ['Quente', 'VIP', 'Follow-up'],
  },
];

function FunnelPage() {
  return (
    <div className="page-panel">
      <PageHeader
        title="Funil de vendas"
        subtitle="Visualize o processo de vendas e mova contatos entre estágios."
        actionLabel="+ Novo card"
      />

      <div className="board-grid">
        {funnelColumns.map((column) => (
          <div key={column.id} className="board-column">
            <div className="board-column-header">
              <div>
                <h3>{column.title}</h3>
                <p>{column.total} cards · {column.value}</p>
              </div>
              <button className="small-button">+</button>
            </div>
            <div className="board-column-body">
              {funnelCards
                .filter((card) => card.stage === column.id)
                .map((card) => (
                  <div key={card.id} className="kanban-card">
                    <div className="kanban-card-header">
                      <span>{card.name}</span>
                      <strong>{card.value}</strong>
                    </div>
                    <div className="kanban-tags">
                      {card.tags.map((tag) => (
                        <span key={tag} className="tag-badge">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FunnelPage;

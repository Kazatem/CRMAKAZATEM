import { PageHeader } from '../components/PageHeader';

const tags = [
  { id: 't1', label: 'VIP', description: '3+ compras ou ticket alto' },
  { id: 't2', label: 'Promoção', description: 'Interessada em promoções' },
  { id: 't3', label: 'Nova cliente', description: 'Primeiro contato nos últimos 7 dias' },
  { id: 't4', label: 'Recuperar', description: 'Sem compra há 30+ dias' },
  { id: 't5', label: 'Retorno', description: 'Voltou após inatividade' },
  { id: 't6', label: 'Follow-up', description: 'Aguardando resposta' },
];

function TagsPage() {
  return (
    <div className="page-panel">
      <PageHeader
        title="Etiquetas"
        subtitle="Gerencie as etiquetas que a IA aplica automaticamente ou oferece para o vendedor."
        actionLabel="+ Nova etiqueta"
      />

      <div className="tags-grid">
        {tags.map((tag) => (
          <div key={tag.id} className="tag-card">
            <div className="tag-label">{tag.label}</div>
            <p>{tag.description}</p>
            <div className="tag-actions">
              <span className="tag-mode">IA automática</span>
              <span className="tag-mode">Manual também</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TagsPage;

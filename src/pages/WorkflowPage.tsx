import { PageHeader } from '../components/PageHeader';

const workflowSteps = [
  {
    id: 1,
    title: 'Cliente manda mensagem',
    description: 'WhatsApp, Instagram Direct ou comentário em post',
    badge: 'GATILHO',
  },
  {
    id: 2,
    title: 'IA analisa a conversa',
    description: 'Score de intenção e classificação de temperatura em tempo real',
    badge: 'IA AUTOMÁTICA',
  },
  {
    id: 3,
    title: 'Etiqueta aplicada automaticamente',
    description: 'Cliente recebe tag de acordo com comportamento (VIP, Nova, Promo...)',
    badge: 'AUTOMAÇÃO',
  },
  {
    id: 4,
    title: 'Sugestão de resposta ao vendedor',
    description: 'IA gera opções de resposta no painel lateral com base na temperatura',
    badge: 'IA AUTOMÁTICA',
  },
  {
    id: 5,
    title: 'Sem resposta em 24h → disparo automático',
    description: 'Mensagem de retomada personalizada é enviada',
    badge: 'AUTOMAÇÃO',
  },
  {
    id: 6,
    title: 'Venda fechada → move no funil + tag VIP',
    description: 'Card movido para coluna Fechado e cliente recebe tag VIP se atingir critérios',
    badge: 'AUTOMAÇÃO',
  },
];

function WorkflowPage() {
  return (
    <div className="page-panel">
      <PageHeader
        title="Fluxo de atendimento"
        subtitle="Visualize o fluxo automático que acontece em cada conversa até o fechamento."
      />

      <div className="workflow-board">
        {workflowSteps.map((step) => (
          <div key={step.id} className="workflow-card">
            <div className="workflow-step">{step.id}</div>
            <div className="workflow-content">
              <div className="workflow-title">{step.title}</div>
              <div className="workflow-description">{step.description}</div>
            </div>
            <div className="workflow-badge">{step.badge}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WorkflowPage;

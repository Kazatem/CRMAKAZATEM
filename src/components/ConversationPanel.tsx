interface Message {
  from: 'cliente' | 'vendedora';
  text: string;
  time: string;
}
interface TimelineItem {
  title: string;
  subtitle: string;
}
interface Conversation {
  id: string;
  source: string;
  customer: string;
  phone: string;
  status: string;
  labels: string[];
  channelCode: string;
  amount: string;
  excerpt: string;
  messages: Message[];
  timeline: TimelineItem[];
}
interface Props {
  conversation: Conversation;
  isAdmin?: boolean;
}

export function ConversationPanel({ conversation, isAdmin }: Props) {
  return (
    <div className="conversation-detail">
      <div className="conversation-detail-header full-header">
        <div className="customer-info">
          <div className="conversation-avatar large">{conversation.customer.split(' ').map((part) => part[0]).join('').slice(0, 2)}</div>
          <div>
            <div className="conversation-title">{conversation.customer}</div>
            <div className="conversation-meta-row">
              <span>{conversation.phone}</span>
              <span className="channel-pill">{conversation.channelCode} via {conversation.source}</span>
            </div>
            <div className="conversation-labels-row">
              {conversation.labels.map((label) => (
                <span key={label} className="tag-badge">{label}</span>
              ))}
              <span className="add-button">+ Adicionar</span>
            </div>
          </div>
        </div>
        <div className="status-chip status-large">{conversation.status}</div>
      </div>
      <div className="conversation-summary">
        <div className="summary-card"><span>Compras</span><strong>7</strong></div>
        <div className="summary-card"><span>Ticket médio</span><strong>{conversation.amount}</strong></div>
        <div className="summary-card"><span>Score IA</span><strong>87/100</strong></div>
      </div>
      <div className="recent-conversation">
        <div className="recent-title">Conversa recente</div>
        <div className="recent-message">{conversation.messages[0].text}</div>
      </div>
      <div className="messages-window">
        {conversation.messages.map((message, index) => (
          <div key={index} className={`message-bubble ${message.from === 'vendedora' ? 'seller' : 'customer'}`}>
            <div className="bubble-text">{message.text}</div>
            <div className="bubble-time">{message.time}</div>
          </div>
        ))}
      </div>
      <div className="timeline-box">
        <div className="timeline-title">Jornada da cliente</div>
        <div className="timeline-list">
          {conversation.timeline.map((item) => (
            <div key={item.title} className="timeline-item">
              <span className="timeline-dot" />
              <div>
                <strong>{item.title}</strong>
                <div className="timeline-subtitle">{item.subtitle}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bottom-actions">
        <button className="secondary-button">Enviar WhatsApp</button>
        <button className="secondary-button">Disparo manual</button>
        <button className="secondary-button">Mover no funil</button>
      </div>
      <div className="composer-bar">
        {isAdmin && (
          <div className="mb-2 rounded-xl bg-amber-50 px-4 py-2 text-xs font-medium text-amber-700 border border-amber-200">
            ⚠️ Você está respondendo como administrador
          </div>
        )}
        <textarea className="assistant-input" placeholder="Escreva uma resposta..." rows={4} />
        <button className="send-button">Enviar mensagem</button>
      </div>
    </div>
  );
}

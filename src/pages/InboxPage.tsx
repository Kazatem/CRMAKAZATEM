import { useMemo, useState } from 'react';
import { ConversationPanel } from '../components/ConversationPanel';
import { AIHelperPanel } from '../components/AIHelperPanel';

const sources = ['WhatsApp', 'Direct', 'Comentários'] as const;
type Source = (typeof sources)[number];

type Message = {
  from: 'cliente' | 'vendedora';
  text: string;
  time: string;
};

type TimelineItem = {
  title: string;
  subtitle: string;
};

type Conversation = {
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
};

const mockConversations: Conversation[] = [
  {
    id: 'c1',
    source: 'WhatsApp',
    customer: 'Mariana Costa',
    phone: '+55 11 98765-4321',
    status: 'Quente',
    labels: ['VIP', 'Follow-up'],
    channelCode: 'W',
    amount: 'R$ 480',
    excerpt: 'Quero levar o vestido azul, qual o pix?',
    messages: [
      { from: 'cliente', text: 'Quero levar o vestido azul, qual o pix?', time: '14:30' },
      { from: 'vendedora', text: 'Olá Mari! Sim, temos no P, M e G. R$ 480 já com frete grátis pra você. 😍', time: '14:26' },
    ],
    timeline: [
      { title: 'Primeiro contato', subtitle: 'Veio do Instagram via story · 12/05/2024' },
      { title: '1ª compra', subtitle: 'Blusa floral · R$ 180 · 20/05/2024' },
      { title: 'Virou VIP', subtitle: 'Atingiu 3 compras · 10/07/2024' },
      { title: 'Iniciou conversa', subtitle: 'Pediu vestido azul · hoje' },
    ],
  },
  {
    id: 'c2',
    source: 'Direct',
    customer: 'Juliana Almeida',
    phone: '+55 21 97654-3210',
    status: 'Quente',
    labels: ['Promoção', 'Follow-up'],
    channelCode: 'IG',
    amount: 'R$ 260',
    excerpt: 'Tem desconto se levar duas?',
    messages: [
      { from: 'cliente', text: 'Tem desconto se levar duas?', time: '14:20' },
      { from: 'vendedora', text: 'Temos 5% de desconto no pix e parcelamos em até 3x sem juros.', time: '14:22' },
    ],
    timeline: [
      { title: 'Primeiro contato', subtitle: 'Comentou na publicação · 08/08/2024' },
      { title: 'Interesse detectado', subtitle: 'Mostrou interesse em promoção' },
      { title: 'Nova conversa', subtitle: 'Perguntou sobre desconto · hoje' },
    ],
  },
  {
    id: 'c3',
    source: 'Comentários',
    customer: 'Patrícia Mendes',
    phone: '+55 31 96543-2109',
    status: 'Morno',
    labels: ['Nova cliente'],
    channelCode: 'C',
    amount: 'R$ 0',
    excerpt: 'Vou pensar e te aviso',
    messages: [
      { from: 'cliente', text: 'Vou pensar e te aviso', time: '14:25' },
      { from: 'vendedora', text: 'Claro! Posso deixar reservada por 1 hora se quiser.', time: '14:27' },
    ],
    timeline: [
      { title: 'Primeiro contato', subtitle: 'Comentou em post · 16/08/2024' },
      { title: 'Seguiu a página', subtitle: 'Ficou de ver o look' },
    ],
  },
];

function InboxPage() {
  const [activeSource, setActiveSource] = useState<Source>('WhatsApp');
  const [activeConversationId, setActiveConversationId] = useState(mockConversations[0].id);

  const availableConversations = useMemo(
    () => mockConversations.filter((conversation) => conversation.source === activeSource),
    [activeSource]
  );

  const activeConversation = useMemo(
    () => mockConversations.find((conversation) => conversation.id === activeConversationId) ?? availableConversations[0],
    [activeConversationId, availableConversations]
  );

  return (
    <div className="inbox-grid">
      <section className="panel inbox-panel">
        <div className="panel-header">
          <div>
            <h2>Caixa de entrada</h2>
            <p>Veja conversas recentes e responda rapidamente pelo canal certo.</p>
          </div>
          <input className="search-input" placeholder="Buscar conversa..." />
        </div>

        <div className="tabs inbox-tabs">
          {sources.map((source) => (
            <button
              key={source}
              className={`tab ${activeSource === source ? 'active' : ''}`}
              onClick={() => setActiveSource(source)}
            >
              {source}
            </button>
          ))}
        </div>

        <div className="conversation-list">
          {availableConversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`conversation-item ${conversation.id === activeConversation?.id ? 'active' : ''}`}
              onClick={() => setActiveConversationId(conversation.id)}
            >
              <div className="conversation-avatar">{conversation.customer.split(' ').map((name) => name[0]).join('').slice(0, 2)}</div>
              <div className="conversation-info">
                <div className="conversation-name-row">
                  <strong>{conversation.customer}</strong>
                  <span className="item-amount">{conversation.amount}</span>
                </div>
                <p className="conversation-excerpt">{conversation.excerpt}</p>
                <div className="conversation-badges">
                  <span className={`status-badge status-${conversation.status.toLowerCase()}`}>{conversation.status}</span>
                  {conversation.labels.map((label) => (
                    <span key={label} className="tag-badge">{label}</span>
                  ))}
                </div>
              </div>
              <span className="conversation-time">há 5min</span>
            </div>
          ))}
        </div>
      </section>

      <section className="panel conversation-panel">
        <ConversationPanel conversation={activeConversation!} />
      </section>

      <section className="panel helper-panel">
        <AIHelperPanel />
      </section>
    </div>
  );
}

export default InboxPage;

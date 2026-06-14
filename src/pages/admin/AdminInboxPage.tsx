import { useEffect, useMemo, useState } from 'react';
import api from '../../api';
import { ConversationPanel } from '../../components/ConversationPanel';
import { AIHelperPanel } from '../../components/AIHelperPanel';

type Source = 'WhatsApp' | 'Direct' | 'Comentários';
const sources: Source[] = ['WhatsApp', 'Direct', 'Comentários'];

interface Message { from: 'cliente' | 'vendedora'; text: string; time: string; }
interface TimelineItem { title: string; subtitle: string; }
interface Conversation {
  id: string; source: string; customer: string; phone: string;
  status: string; labels: string[]; channelCode: string; amount: string;
  excerpt: string; messages: Message[]; timeline: TimelineItem[];
}
interface Vendedor { id: number; name: string; email: string; role: string; }

const mockConversationsByVendedor: Record<number, Conversation[]> = {
  1: [
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
        { from: 'vendedora', text: 'Olá Mari! R$ 480 com frete grátis. 😍', time: '14:26' },
      ],
      timeline: [
        { title: 'Primeiro contato', subtitle: 'Instagram · 12/05/2024' },
        { title: 'Iniciou conversa', subtitle: 'Pediu vestido azul · hoje' },
      ],
    },
    {
      id: 'c2',
      source: 'Direct',
      customer: 'Juliana Almeida',
      phone: '+55 21 97654-3210',
      status: 'Quente',
      labels: ['Promoção'],
      channelCode: 'IG',
      amount: 'R$ 260',
      excerpt: 'Tem desconto se levar duas?',
      messages: [
        { from: 'cliente', text: 'Tem desconto se levar duas?', time: '14:20' },
        { from: 'vendedora', text: '5% no pix ou 3x sem juros!', time: '14:22' },
      ],
      timeline: [
        { title: 'Primeiro contato', subtitle: 'Comentou na publicação · 08/08/2024' },
      ],
    },
  ],
};

export default function AdminInboxPage() {
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [selectedVendedor, setSelectedVendedor] = useState<Vendedor | null>(null);
  const [activeSource, setActiveSource] = useState<Source>('WhatsApp');
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  useEffect(() => {
    api.get('/users').then((res) => {
      const sellers = res.data.filter((u: Vendedor) => u.role === 'vendedor');
      setVendedores(sellers);
      if (sellers.length > 0) setSelectedVendedor(sellers[0]);
    });
  }, []);

  const conversations: Conversation[] = useMemo(() => {
    if (!selectedVendedor) return [];
    const all = mockConversationsByVendedor[selectedVendedor.id] ?? [];
    return all.filter((c) => c.source === activeSource);
  }, [selectedVendedor, activeSource]);

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeConversationId) ?? conversations[0] ?? null,
    [activeConversationId, conversations]
  );

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-lg shadow-slate-200/40">
        <h2 className="text-2xl font-semibold text-slate-950">Inbox dos Vendedores</h2>
        <p className="mt-1 text-sm text-slate-500">Selecione um vendedor para ver e intervir nas conversas.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        {vendedores.map((v) => (
          <button
            key={v.id}
            onClick={() => { setSelectedVendedor(v); setActiveConversationId(null); }}
            className={`rounded-2xl px-5 py-2 text-sm font-medium transition ${
              selectedVendedor?.id === v.id
                ? 'bg-slate-950 text-white'
                : 'bg-white text-slate-700 shadow hover:bg-slate-100'
            }`}
          >
            {v.name}
          </button>
        ))}
      </div>

      {selectedVendedor && (
        <div className="inbox-grid">
          <section className="panel inbox-panel">
            <div className="panel-header">
              <div>
                <h2>Conversas de {selectedVendedor.name}</h2>
                <p>Você pode ver e responder como administrador.</p>
              </div>
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
              {conversations.length === 0 && (
                <p className="p-4 text-sm text-slate-400">Nenhuma conversa neste canal.</p>
              )}
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`conversation-item ${conversation.id === activeConversation?.id ? 'active' : ''}`}
                  onClick={() => setActiveConversationId(conversation.id)}
                >
                  <div className="conversation-avatar">
                    {conversation.customer.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="conversation-info">
                    <div className="conversation-name-row">
                      <strong>{conversation.customer}</strong>
                      <span className="item-amount">{conversation.amount}</span>
                    </div>
                    <p className="conversation-excerpt">{conversation.excerpt}</p>
                    <div className="conversation-badges">
                      <span className={`status-badge status-${conversation.status.toLowerCase()}`}>
                        {conversation.status}
                      </span>
                      {conversation.labels.map((label) => (
                        <span key={label} className="tag-badge">{label}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section className="panel conversation-panel">
            {activeConversation ? (
              <ConversationPanel conversation={activeConversation} isAdmin />
            ) : (
              <div className="flex h-full items-center justify-center text-slate-400 text-sm">
                Selecione uma conversa
              </div>
            )}
          </section>
          <section className="panel helper-panel">
            <AIHelperPanel />
          </section>
        </div>
      )}
    </div>
  );
}

import { PageHeader } from '../components/PageHeader';

type Client = {
  id: string;
  name: string;
  phone: string;
  channel: 'W' | 'IG' | 'C';
  temperature: 'Quente' | 'Morno' | 'Frio';
  labels: string[];
  purchases: number;
  ticket: string;
  score: number;
};

const clients: Client[] = [
  {
    id: 'c1',
    name: 'Mariana Costa',
    phone: '+55 11 98765-4321',
    channel: 'W',
    temperature: 'Quente',
    labels: ['VIP', 'Follow-up'],
    purchases: 7,
    ticket: 'R$ 320',
    score: 87,
  },
  {
    id: 'c2',
    name: 'Juliana Almeida',
    phone: '+55 21 97654-3210',
    channel: 'IG',
    temperature: 'Quente',
    labels: ['Promoção', 'Follow-up'],
    purchases: 2,
    ticket: 'R$ 175',
    score: 78,
  },
  {
    id: 'c3',
    name: 'Patrícia Mendes',
    phone: '+55 31 96543-2109',
    channel: 'W',
    temperature: 'Morno',
    labels: ['Nova cliente'],
    purchases: 0,
    ticket: 'R$ 0',
    score: 52,
  },
  {
    id: 'c4',
    name: 'Carla Souza',
    phone: '+55 41 95432-1098',
    channel: 'C',
    temperature: 'Morno',
    labels: ['Promoção'],
    purchases: 1,
    ticket: 'R$ 145',
    score: 45,
  },
  {
    id: 'c5',
    name: 'Renata Lima',
    phone: '+55 61 94321-0987',
    channel: 'W',
    temperature: 'Frio',
    labels: ['Recuperar'],
    purchases: 4,
    ticket: 'R$ 290',
    score: 18,
  },
];

function ClientsPage() {
  return (
    <div className="page-panel">
      <PageHeader
        title="Clientes"
        subtitle="Veja todos os clientes, seus canais de contato, temperatura e etiquetas."
        actionLabel="+ Nova cliente"
      />

      <div className="table-card">
        <table className="clients-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Canal</th>
              <th>Temperatura</th>
              <th>Etiquetas</th>
              <th>Compras</th>
              <th>Ticket médio</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id}>
                <td className="client-cell">
                  <div className="client-avatar">
                    {client.name
                      .split(' ')
                      .map((part) => part[0])
                      .join('')
                      .slice(0, 2)}
                  </div>
                  <div>
                    <strong>{client.name}</strong>
                    <div className="client-phone">{client.phone}</div>
                  </div>
                </td>
                <td>
                  <span className={`channel-badge channel-${client.channel.toLowerCase()}`}>
                    {client.channel}
                  </span>
                </td>
                <td>
                  <span className={`temperature-badge temp-${client.temperature.toLowerCase()}`}>
                    {client.temperature}
                  </span>
                </td>
                <td className="tags-cell">
                  {client.labels.map((label) => (
                    <span key={label} className="tag-badge">
                      {label}
                    </span>
                  ))}
                </td>
                <td>{client.purchases}</td>
                <td>{client.ticket}</td>
                <td>
                  <div className="score-cell">
                    <div className="score-bar">
                      <div className="score-fill" style={{ width: `${client.score}%` }} />
                    </div>
                    <span>{client.score}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ClientsPage;

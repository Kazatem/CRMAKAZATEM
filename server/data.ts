export const conversations = [
  {
    id: 'c1',
    channel: 'WhatsApp',
    customer: 'Maria Silva',
    messages: [
      { from: 'cliente', text: 'Olá, você tem o conjunto de cama queen disponível?', time: '09:12' },
      { from: 'vendedora', text: 'Sim, temos várias opções de cetim e algodão.', time: '09:13' },
    ],
    status: 'Em atendimento',
  },
  {
    id: 'c2',
    channel: 'Direct',
    customer: 'Juliana',
    messages: [
      { from: 'cliente', text: 'Qual é o prazo de entrega para cobertor?', time: '11:25' },
      { from: 'vendedora', text: 'Entrega em até 3 dias úteis para sua região.', time: '11:28' },
    ],
    status: 'Aguardando resposta',
  },
];

export const sellers = [
  { id: 's1', name: 'Vanessa', email: 'vanessa@crm.com', sales: 28, goal: 40, active: true },
  { id: 's2', name: 'Juliana', email: 'juliana@crm.com', sales: 22, goal: 35, active: true },
];

export const automation = {
  upcomingBirthdays: [
    { customer: 'Mariana', date: '2026-06-10', discount: '10%' },
    { customer: 'Patrícia', date: '2026-06-12', discount: 'Frete grátis' },
  ],
  followUps: [
    { customer: 'Camila', daysWithoutPurchase: 18, suggestion: 'Enviar oferta personalizada de enxoval.' },
  ],
};

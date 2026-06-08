import { useState } from 'react';

const suggestionCards = [
  {
    title: 'Fechar venda',
    description: 'Posso reservar agora pra você? Tenho duas formas de pagamento: pix com 5% de desconto ou cartão em até 3x sem juros.',
  },
  {
    title: 'Criar urgência',
    description: 'É a última peça nesse tamanho! Se preferir, te envio o link para fechar direto.',
  },
  {
    title: 'Upsell',
    description: 'Ah, e temos uma bolsa que combina perfeito com esse vestido. Quer que eu te mostre?',
  },
];

export function AIHelperPanel() {
  return (
    <div className="assistant-box">
      <div className="ai-header-block">
        <div>
          <div className="helper-title">Painel da IA</div>
          <div className="helper-subtitle">Probabilidade de fechamento</div>
        </div>
        <div className="probability-card">
          <div className="probability-value">87%</div>
          <div className="probability-bar">
            <div className="probability-fill" style={{ width: '87%' }} />
          </div>
        </div>
      </div>

      <div className="insight-card">
        <div className="insight-row">
          <span className="insight-label">Insight</span>
          <span className="insight-tag">Alta intenção</span>
        </div>
        <p>Cliente em alta intenção de compra. Foque em fechar agora — qualquer fricção pode esfriar a conversa.</p>
      </div>

      <div className="suggestions-section">
        <div className="section-title">Sugestões de resposta</div>
        {suggestionCards.map((card) => (
          <div key={card.title} className="suggestion-card">
            <div>
              <div className="suggestion-title">{card.title}</div>
              <p>{card.description}</p>
            </div>
            <button className="suggestion-button">Usar</button>
          </div>
        ))}
      </div>
    </div>
  );
}

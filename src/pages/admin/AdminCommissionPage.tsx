import { useEffect, useState } from 'react';
import api from '../../api';

export default function AdminCommissionPage() {
  const [taxaPercentual, setTaxaPercentual] = useState('5.00');
  const [newTaxa, setNewTaxa] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/config/commission')
      .then((response) => {
        const taxa = response.data.taxa_percentual;
        setTaxaPercentual(taxa.toFixed(2));
        setNewTaxa(taxa.toFixed(2));
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    if (!newTaxa || Number(newTaxa) < 0 || Number(newTaxa) > 100) {
      setMessage('Informe uma taxa válida entre 0% e 100%.');
      return;
    }

    try {
      const response = await api.put('/config/commission', {
        taxa_percentual: Number(newTaxa),
      });

      setTaxaPercentual(response.data.taxa_percentual.toFixed(2));
      setNewTaxa(response.data.taxa_percentual.toFixed(2));
      setMessage('Taxa de comissão atualizada com sucesso.');
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setMessage('Erro ao atualizar a taxa. Tente novamente.');
    }
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-8 shadow-lg shadow-slate-200/40">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">Comissões</h2>
            <p className="mt-2 text-slate-500">Configure a taxa de comissão que será paga aos vendedores.</p>
          </div>
          <div className="rounded-3xl bg-emerald-50 px-4 py-3 text-emerald-900">
            Taxa atual: <strong>{taxaPercentual}%</strong>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="text-lg font-semibold text-slate-950">Informações sobre comissão</h3>
            <div className="mt-6 space-y-4">
              <div>
                <p className="text-sm font-medium text-slate-700">Taxa de comissão atual</p>
                <p className="mt-2 text-4xl font-bold text-slate-950">{taxaPercentual}%</p>
                <p className="mt-2 text-sm text-slate-500">Essa é a porcentagem do faturamento que será creditada aos vendedores.</p>
              </div>
              <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Exemplo de cálculo</p>
                <p className="mt-3 text-sm text-slate-900">
                  Se um vendedor fatura <strong>R$ 1.000,00</strong>, ele receberá:{' '}
                  <strong>R$ {(1000 * Number(taxaPercentual) / 100).toFixed(2)}</strong>
                </p>
              </div>
            </div>
          </div>

          <aside className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="text-lg font-semibold text-slate-950">Alterar taxa</h3>
            <p className="mt-2 text-sm text-slate-500">Digite a nova taxa de comissão em percentual.</p>
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Nova taxa (%)</label>
                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={newTaxa}
                    onChange={(event) => setNewTaxa(event.target.value)}
                    className="flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                    placeholder="5.00"
                  />
                  <span className="text-sm font-semibold text-slate-700">%</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSave}
                className="w-full rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400"
              >
                Salvar taxa
              </button>

              {message ? (
                <div className={`rounded-2xl px-4 py-3 text-sm font-medium ${message.includes('sucesso') ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                  {message}
                </div>
              ) : null}
            </div>
          </aside>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-8 shadow-lg shadow-slate-200/40">
        <h3 className="text-xl font-semibold text-slate-950">Política de comissões</h3>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Como funciona</p>
            <p className="mt-3 text-sm text-slate-900">
              A comissão é calculada sobre o valor total de cada venda registrada. Os vendedores recebem o percentual configurado automaticamente.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Quando recebem</p>
            <p className="mt-3 text-sm text-slate-900">
              A comissão é creditada no final de cada mês com base no total de vendas do período. Acesse o painel do vendedor para conferir.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Alterações futuras</p>
            <p className="mt-3 text-sm text-slate-900">
              Novas taxas aplicadas aqui afetarão as comissões calculadas a partir do mês seguinte.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

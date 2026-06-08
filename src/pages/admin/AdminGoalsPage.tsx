import { useEffect, useState } from 'react';
import api from '../../api';
import type { Goal, User } from '../../types';

export default function AdminGoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [sellers, setSellers] = useState<User[]>([]);
  const [selectedSeller, setSelectedSeller] = useState<number | ''>('');
  const [meta, setMeta] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    Promise.all([api.get('/goals'), api.get('/users')])
      .then(([goalsResponse, usersResponse]) => {
        setGoals(goalsResponse.data);
        setSellers(usersResponse.data.filter((user: User) => user.role === 'vendedor'));
      })
      .catch(() => {
        setFeedback('Não foi possível carregar metas ou vendedores.');
      });
  }, []);

  const handleSave = async () => {
    if (!selectedSeller || !meta) {
      setFeedback('Selecione vendedor e defina meta mensal.');
      return;
    }

    try {
      const response = await api.post('/goals', {
        vendedor_id: selectedSeller,
        meta_mensal: Number(meta),
      });
      setFeedback('Meta atualizada com sucesso.');
      setGoals((current) => {
        const existing = current.find((item) => item.vendedor_id === response.data.vendedor_id);
        if (existing) {
          return current.map((item) => (item.vendedor_id === existing.vendedor_id ? response.data : item));
        }
        return [...current, response.data];
      });
    } catch {
      setFeedback('Erro ao salvar a meta. Tente novamente.');
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-8 shadow-lg shadow-slate-200/40">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">Metas</h2>
            <p className="mt-2 text-slate-500">Defina metas mensais por vendedor e acompanhe o desempenho.</p>
          </div>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400"
          >
            Salvar meta
          </button>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[380px_1fr]">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <label className="block text-sm font-medium text-slate-700">Vendedor</label>
            <select
              value={selectedSeller}
              onChange={(event) => setSelectedSeller(event.target.value ? Number(event.target.value) : '')}
              className="mt-3 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
            >
              <option value="">Selecione um vendedor</option>
              {sellers.map((seller) => (
                <option key={seller.id} value={seller.id}>{seller.name}</option>
              ))}
            </select>

            <label className="mt-6 block text-sm font-medium text-slate-700">Meta mensal</label>
            <input
              type="number"
              value={meta}
              onChange={(event) => setMeta(event.target.value)}
              className="mt-3 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              placeholder="R$ 0.00"
            />
            {feedback ? <p className="mt-4 text-sm text-emerald-700">{feedback}</p> : null}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-slate-950">Metas atuais</h3>
            <div className="mt-6 space-y-4">
              {goals.map((goal) => (
                <div key={goal.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-500">{goal.vendedor}</p>
                  <p className="mt-2 text-xl font-semibold text-slate-950">R$ {goal.meta_mensal}</p>
                  <p className="mt-1 text-sm text-slate-500">Atualizado em {new Date(goal.updated_at).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

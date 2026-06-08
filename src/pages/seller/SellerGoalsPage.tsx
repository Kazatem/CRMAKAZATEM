import { useEffect, useState } from 'react';
import api from '../../api';

export default function SellerGoalsPage() {
  const [goals, setGoals] = useState<{ vendedor: string; meta_mensal: number; updated_at: string }[]>([]);

  useEffect(() => {
    api.get('/goals').then((response) => setGoals(response.data));
  }, []);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-8 shadow-lg shadow-slate-200/40">
        <h2 className="text-2xl font-semibold text-slate-950">Metas</h2>
        <p className="mt-2 text-slate-500">Acompanhe sua meta mensal e o desempenho do mês.</p>
      </section>
      <section className="rounded-3xl bg-white p-8 shadow-lg shadow-slate-200/40">
        <div className="grid gap-6 sm:grid-cols-2">
          {goals.map((goal) => (
            <div key={goal.vendedor} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Meta</p>
              <h3 className="mt-4 text-2xl font-semibold text-slate-950">R$ {goal.meta_mensal.toFixed(2)}</h3>
              <p className="mt-3 text-sm text-slate-500">Última atualização: {new Date(goal.updated_at).toLocaleDateString()}</p>
            </div>
          ))}
          {!goals.length ? <p className="text-slate-500">Nenhuma meta definida ainda.</p> : null}
        </div>
      </section>
    </div>
  );
}

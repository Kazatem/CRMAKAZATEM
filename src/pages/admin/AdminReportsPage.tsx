import { useEffect, useState } from 'react';
import api from '../../api';

interface DashboardData {
  faturamento_total: string;
  total_vendedores: number;
  total_vendas: number;
}

interface RankingItem {
  vendedor: string;
  total_vendas: string;
  total_faturamento: string;
}

export default function AdminReportsPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [ranking, setRanking] = useState<RankingItem[]>([]);

  useEffect(() => {
    api.get('/reports/admin').then((response) => {
      setDashboard(response.data.dashboard);
      setRanking(response.data.ranking);
    });
  }, []);

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-white p-8 shadow-lg shadow-slate-200/40">
        <h2 className="text-2xl font-semibold text-slate-950">Relatórios</h2>
        <p className="mt-2 text-slate-500">Análise completa de vendas e desempenho dos vendedores.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <article className="rounded-3xl bg-white p-6 shadow-lg shadow-slate-200/40">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Faturamento</p>
          <p className="mt-4 text-3xl font-semibold text-slate-950">R$ {dashboard?.faturamento_total ?? '0.00'}</p>
          <p className="mt-3 text-sm text-slate-500">Total faturado pela empresa</p>
        </article>
        <article className="rounded-3xl bg-white p-6 shadow-lg shadow-slate-200/40">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Vendedores</p>
          <p className="mt-4 text-3xl font-semibold text-slate-950">{dashboard?.total_vendedores ?? 0}</p>
          <p className="mt-3 text-sm text-slate-500">Vendedores ativos no CRM</p>
        </article>
        <article className="rounded-3xl bg-white p-6 shadow-lg shadow-slate-200/40">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Vendas</p>
          <p className="mt-4 text-3xl font-semibold text-slate-950">{dashboard?.total_vendas ?? 0}</p>
          <p className="mt-3 text-sm text-slate-500">Transações registradas</p>
        </article>
      </div>

      <section className="rounded-3xl bg-white p-8 shadow-lg shadow-slate-200/40">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-slate-950">Ranking de performance</h3>
            <p className="mt-1 text-sm text-slate-500">Veja os vendedores com melhor resultado por faturamento.</p>
          </div>
          <span className="rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-700">Sempre atualizado</span>
        </div>
        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-6 py-4">Vendedor</th>
                <th className="px-6 py-4">Vendas</th>
                <th className="px-6 py-4">Faturamento</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((item) => (
                <tr key={item.vendedor} className="border-t border-slate-200">
                  <td className="px-6 py-4 font-medium text-slate-900">{item.vendedor}</td>
                  <td className="px-6 py-4">{item.total_vendas}</td>
                  <td className="px-6 py-4">R$ {item.total_faturamento}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}


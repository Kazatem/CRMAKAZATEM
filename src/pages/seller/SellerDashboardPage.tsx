import { useEffect, useState } from 'react';
import api from '../../api';

export default function SellerDashboardPage() {
  const [report, setReport] = useState<{ total_vendido: number; meta_mensal: number; vendas: any[] } | null>(null);

  useEffect(() => {
    api.get('/reports/seller').then((response) => setReport(response.data));
  }, []);

  const progress = report ? Math.min(100, Math.round((report.total_vendido / report.meta_mensal) * 100)) : 0;

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-8 shadow-lg shadow-slate-200/40">
        <h2 className="text-2xl font-semibold text-slate-950">Seu dashboard</h2>
        <p className="mt-2 text-slate-500">Acompanhe suas vendas, comissão e metas pessoais.</p>
      </section>

      <div className="grid gap-6 md:grid-cols-3">
        <article className="rounded-3xl bg-white p-6 shadow-lg shadow-slate-200/40">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Total vendido</p>
          <p className="mt-4 text-3xl font-semibold text-slate-950">R$ {report?.total_vendido.toFixed(2) ?? '0.00'}</p>
        </article>
        <article className="rounded-3xl bg-white p-6 shadow-lg shadow-slate-200/40">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Meta mensal</p>
          <p className="mt-4 text-3xl font-semibold text-slate-950">R$ {report?.meta_mensal.toFixed(2) ?? '0.00'}</p>
        </article>
        <article className="rounded-3xl bg-white p-6 shadow-lg shadow-slate-200/40">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Progresso</p>
          <p className="mt-4 text-3xl font-semibold text-slate-950">{progress}%</p>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-cyan-500" style={{ width: `${progress}%` }} />
          </div>
        </article>
      </div>

      <section className="rounded-3xl bg-white p-8 shadow-lg shadow-slate-200/40">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-slate-950">Vendas recentes</h3>
            <p className="mt-1 text-sm text-slate-500">Últimas operações registradas.</p>
          </div>
          <span className="rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-700">Atualizado</span>
        </div>
        <div className="mt-6 space-y-4">
          {report?.vendas.slice(0, 4).map((sale: any, index: number) => (
            <div key={index} className="rounded-3xl border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{sale.produto}</p>
                  <p className="text-sm text-slate-500">Cliente: {sale.cliente}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">R$ {Number(sale.valor).toFixed(2)}</span>
              </div>
              <p className="mt-3 text-sm text-slate-500">Data: {new Date(sale.data_venda).toLocaleDateString()}</p>
            </div>
          ))}
          {!report?.vendas.length ? <p className="text-sm text-slate-500">Nenhuma venda registrada ainda.</p> : null}
        </div>
      </section>
    </div>
  );
}

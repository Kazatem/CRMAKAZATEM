import { useEffect, useState } from 'react';
import api from '../../api';

export default function SellerCommissionsPage() {
  const [report, setReport] = useState<any>(null);
  const [taxaPercentual, setTaxaPercentual] = useState(5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/reports/seller'), api.get('/config/commission')])
      .then(([reportResponse, commissionResponse]) => {
        setReport(reportResponse.data);
        setTaxaPercentual(commissionResponse.data.taxa_percentual);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Carregando...</div>;
  }

  const totalVendido = report?.total_vendido || 0;
  const comissaoMesAtual = (totalVendido * taxaPercentual) / 100;

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-8 shadow-lg shadow-slate-200/40">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">Comissões</h2>
            <p className="mt-2 text-slate-500">Acompanhe suas comissões e o cálculo do mês atual.</p>
          </div>
          <div className="rounded-3xl bg-cyan-50 px-4 py-3 text-cyan-900">
            Taxa vigente: <strong>{taxaPercentual}%</strong>
          </div>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <article className="rounded-3xl bg-white p-6 shadow-lg shadow-slate-200/40">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Total vendido (mês)</p>
          <p className="mt-4 text-3xl font-semibold text-slate-950">R$ {totalVendido.toFixed(2)}</p>
          <p className="mt-3 text-sm text-slate-500">Valor total de vendas registradas</p>
        </article>
        <article className="rounded-3xl bg-white p-6 shadow-lg shadow-slate-200/40">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Comissão do mês</p>
          <p className="mt-4 text-3xl font-semibold text-emerald-600">R$ {comissaoMesAtual.toFixed(2)}</p>
          <p className="mt-3 text-sm text-slate-500">Comissão a receber ({taxaPercentual}%)</p>
        </article>
      </div>

      <section className="rounded-3xl bg-white p-8 shadow-lg shadow-slate-200/40">
        <h3 className="text-xl font-semibold text-slate-950">Histórico de vendas</h3>
        <p className="mt-1 text-sm text-slate-500">Detalhamento das vendas que compõem sua comissão.</p>
        <div className="mt-6 space-y-4">
          {report?.vendas && report.vendas.length > 0 ? (
            report.vendas.map((sale: any, index: number) => (
              <div key={index} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-900">{sale.produto}</p>
                    <p className="text-sm text-slate-500">{sale.cliente}</p>
                  </div>
                  <div className="text-right">
                    <p className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-700">R$ {Number(sale.valor).toFixed(2)}</p>
                    <p className="mt-2 text-sm font-medium text-emerald-600">+ R$ {(Number(sale.valor) * taxaPercentual / 100).toFixed(2)}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-slate-500">{new Date(sale.data_venda).toLocaleDateString()}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">Nenhuma venda registrada ainda.</p>
          )}
        </div>
      </section>

      <section className="rounded-3xl bg-white p-8 shadow-lg shadow-slate-200/40">
        <h3 className="text-xl font-semibold text-slate-950">Como funcionam as comissões</h3>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Cálculo</p>
            <p className="mt-3 text-sm text-slate-900">
              Sua comissão é calculada como <strong>{taxaPercentual}%</strong> do valor de cada venda registrada no sistema.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Pagamento</p>
            <p className="mt-3 text-sm text-slate-900">
              As comissões são consolidadas mensalmente e pagas conforme a política da empresa. Consulte o administrativo para detalhes.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}


import { useEffect, useState } from 'react';
import api from '../../api';
import type { User } from '../../types';

export default function AdminSalesPage() {
  const [sales, setSales] = useState<any[]>([]);
  const [sellers, setSellers] = useState<User[]>([]);
  const [filterVendedor, setFilterVendedor] = useState('');
  const [filterCliente, setFilterCliente] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const loadSales = async (params: Record<string, string | undefined> = {}) => {
    const response = await api.get('/sales', { params });
    setSales(response.data);
  };

  useEffect(() => {
    api.get('/users').then((response) => setSellers(response.data.filter((user: User) => user.role === 'vendedor')));
    loadSales();
  }, []);

  const handleSearch = async () => {
    await loadSales({ cliente: filterCliente, from: fromDate, to: toDate });
  };

  const handleClearFilters = async () => {
    setFilterVendedor('');
    setFilterCliente('');
    setFromDate('');
    setToDate('');
    await loadSales();
  };

  const filteredSalesByVendor = filterVendedor
    ? sales.filter((sale) => sale.vendedor === filterVendedor)
    : sales;

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-8 shadow-lg shadow-slate-200/40">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">Todas as vendas</h2>
            <p className="mt-2 text-slate-500">Monitore e filtre o histórico completo de vendas por vendedor, cliente ou período.</p>
          </div>
          <div className="rounded-3xl bg-slate-50 px-4 py-3 text-slate-700">
            Total de vendas: <strong>{filteredSalesByVendor.length}</strong>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_420px]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-slate-950">Histórico</h3>
            <div className="mt-6 space-y-4">
              {filteredSalesByVendor.map((sale) => (
                <div key={sale.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">{sale.produto}</p>
                      <p className="text-sm text-slate-500">{sale.cliente} • {sale.vendedor}</p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-700">R$ {Number(sale.valor).toFixed(2)}</span>
                  </div>
                  <p className="mt-3 text-sm text-slate-500">{new Date(sale.data_venda).toLocaleDateString()}</p>
                </div>
              ))}
              {!filteredSalesByVendor.length ? <p className="text-sm text-slate-500">Nenhuma venda encontrada para os filtros aplicados.</p> : null}
            </div>
          </div>

          <aside className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="text-lg font-semibold text-slate-950">Filtrar vendas</h3>
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Vendedor</label>
                <select
                  value={filterVendedor}
                  onChange={(event) => setFilterVendedor(event.target.value)}
                  className="mt-3 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                >
                  <option value="">Todos os vendedores</option>
                  {sellers.map((seller) => (
                    <option key={seller.id} value={seller.name}>{seller.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Cliente</label>
                <input
                  value={filterCliente}
                  onChange={(event) => setFilterCliente(event.target.value)}
                  placeholder="Filtrar por cliente"
                  className="mt-3 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">De</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(event) => setFromDate(event.target.value)}
                  className="mt-3 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Até</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(event) => setToDate(event.target.value)}
                  className="mt-3 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                />
              </div>

              <div className="flex flex-col gap-2 pt-4">
                <button
                  type="button"
                  onClick={handleSearch}
                  className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400"
                >
                  Aplicar filtros
                </button>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Limpar filtros
                </button>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

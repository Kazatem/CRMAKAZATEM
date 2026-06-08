import { useEffect, useState } from 'react';
import api from '../../api';
import type { ClientItem } from '../../types';

export default function SellerSalesPage() {
  const [sales, setSales] = useState<any[]>([]);
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [cliente, setCliente] = useState('');
  const [produto, setProduto] = useState('');
  const [valor, setValor] = useState('');
  const [filterCliente, setFilterCliente] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [message, setMessage] = useState('');

  const loadSales = async (params: Record<string, string | undefined> = {}) => {
    const response = await api.get('/sales', { params });
    setSales(response.data);
  };

  const loadClients = async (search = '') => {
    const response = await api.get('/clients', { params: { search } });
    setClients(response.data);
  };

  useEffect(() => {
    loadSales();
    loadClients();
  }, []);

  const handleSave = async () => {
    if (!cliente.trim() || !produto.trim() || !valor.trim()) {
      setMessage('Preencha todos os campos.');
      return;
    }

    try {
      const response = await api.post('/sales', { cliente: cliente.trim(), produto: produto.trim(), valor: Number(valor) });
      setSales((current) => [response.data, ...current]);
      if (!clients.some((item) => item.name === cliente.trim())) {
        setClients((current) => [{ name: cliente.trim() }, ...current]);
      }
      setCliente('');
      setProduto('');
      setValor('');
      setMessage('Venda registrada com sucesso.');
    } catch {
      setMessage('Erro ao registrar a venda. Tente novamente.');
    }
  };

  const handleSearch = async () => {
    await loadSales({ cliente: filterCliente, from: fromDate, to: toDate });
  };

  const handleClearFilters = async () => {
    setFilterCliente('');
    setFromDate('');
    setToDate('');
    await loadSales();
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-8 shadow-lg shadow-slate-200/40">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">Minhas vendas</h2>
            <p className="mt-2 text-slate-500">Registre vendas e filtre seu histórico por cliente ou período.</p>
          </div>
          <div className="rounded-3xl bg-slate-50 px-4 py-3 text-slate-700">
            Total de vendas: <strong>{sales.length}</strong>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_420px]">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="text-lg font-semibold text-slate-950">Registrar nova venda</h3>
            <p className="mt-2 text-sm text-slate-500">Escolha um cliente ou digite um novo nome para salvar a venda.</p>
            <div className="mt-6 space-y-4">
              <label className="block text-sm font-medium text-slate-700">Cliente</label>
              <select
                value={cliente}
                onChange={(event) => setCliente(event.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              >
                <option value="">Escolher cliente existente</option>
                {clients.map((client) => (
                  <option key={client.id ?? client.name} value={client.name}>
                    {client.name}
                  </option>
                ))}
              </select>
              <input
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                value={cliente}
                onChange={(event) => setCliente(event.target.value)}
                placeholder="Digite o nome do cliente"
              />
              <label className="block text-sm font-medium text-slate-700">Produto</label>
              <input
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                value={produto}
                onChange={(event) => setProduto(event.target.value)}
                placeholder="Nome do produto"
              />
              <label className="block text-sm font-medium text-slate-700">Valor</label>
              <input
                type="number"
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                value={valor}
                onChange={(event) => setValor(event.target.value)}
                placeholder="0.00"
              />
              <button
                type="button"
                onClick={handleSave}
                className="w-full rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                Salvar venda
              </button>
              {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-slate-950">Filtrar histórico</h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700">Cliente</label>
                <input
                  className="mt-3 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                  value={filterCliente}
                  onChange={(event) => setFilterCliente(event.target.value)}
                  placeholder="Filtrar por cliente"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">De</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(event) => setFromDate(event.target.value)}
                  className="mt-3 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Até</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(event) => setToDate(event.target.value)}
                  className="mt-3 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                />
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
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
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-slate-950">Histórico</h3>
          <div className="mt-6 space-y-4">
            {sales.map((sale) => (
              <div key={sale.id} className="rounded-3xl border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-900">{sale.produto}</p>
                    <p className="text-sm text-slate-500">{sale.cliente}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">R$ {Number(sale.valor).toFixed(2)}</span>
                </div>
                <p className="mt-3 text-sm text-slate-500">{new Date(sale.data_venda).toLocaleDateString()}</p>
              </div>
            ))}
            {!sales.length ? <p className="text-sm text-slate-500">Nenhuma venda encontrada para os filtros aplicados.</p> : null}
          </div>
        </div>
      </section>
    </div>
  );
}

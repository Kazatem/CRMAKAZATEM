import { useEffect, useState } from 'react';
import api from '../../api';
import type { ClientItem } from '../../types';

export default function SellerClientsPage() {
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [clientName, setClientName] = useState('');
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');

  const loadClients = async (query = '') => {
    const response = await api.get('/clients', { params: { search: query } });
    setClients(response.data);
  };

  useEffect(() => {
    loadClients();
  }, []);

  const handleSave = async () => {
    if (!clientName.trim()) {
      setMessage('Informe o nome do cliente.');
      return;
    }

    try {
      const response = await api.post('/clients', { nome: clientName.trim() });
      setClients((current) => [response.data, ...current]);
      setClientName('');
      setMessage('Cliente cadastrado com sucesso.');
    } catch {
      setMessage('Erro ao cadastrar cliente. Tente novamente.');
    }
  };

  const handleSearch = async () => {
    await loadClients(search);
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-8 shadow-lg shadow-slate-200/40">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">Clientes</h2>
            <p className="mt-2 text-slate-500">Registre novos clientes e filtre sua carteira de atendimento.</p>
          </div>
          <div className="rounded-3xl bg-slate-50 px-4 py-3 text-slate-700">
            Clientes cadastrados: <strong>{clients.length}</strong>
          </div>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-8 shadow-lg shadow-slate-200/40">
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="text-lg font-semibold text-slate-950">Buscar clientes</h3>
            <div className="mt-6 space-y-4">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Filtrar por nome"
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleSearch}
                  className="flex-1 rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                >
                  Buscar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    loadClients();
                  }}
                  className="flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Limpar
                </button>
              </div>
            </div>
          </div>

          <aside className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="text-lg font-semibold text-slate-950">Cadastrar novo cliente</h3>
            <div className="mt-6 space-y-4">
              <label className="block text-sm font-medium text-slate-700">Nome do cliente</label>
              <input
                value={clientName}
                onChange={(event) => setClientName(event.target.value)}
                placeholder="Nome do cliente"
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              />
              <button
                type="button"
                onClick={handleSave}
                className="w-full rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400"
              >
                Cadastrar cliente
              </button>
              {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
            </div>
          </aside>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-8 shadow-lg shadow-slate-200/40">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <div key={client.id ?? client.name} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-lg font-semibold text-slate-950">{client.name}</p>
              {client.created_at ? (
                <p className="mt-2 text-sm text-slate-500">Cadastrado em {new Date(client.created_at).toLocaleDateString()}</p>
              ) : (
                <p className="mt-2 text-sm text-slate-500">Cliente registrado.</p>
              )}
            </div>
          ))}
          {!clients.length ? <p className="text-slate-500">Nenhum cliente encontrado.</p> : null}
        </div>
      </section>
    </div>
  );
}

import { useEffect, useState } from 'react';
import api from '../../api';

export default function AdminClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  const loadClients = async (query = '') => {
    try {
      const response = await api.get('/clients', { params: { search: query } });
      setClients(response.data);
    } catch {
      setClients([]);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const handleSearch = async () => {
    await loadClients(search);
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-8 shadow-lg shadow-slate-200/40">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">Clientes da empresa</h2>
            <p className="mt-2 text-slate-500">Visualize todos os clientes cadastrados pelos vendedores.</p>
          </div>
          <div className="rounded-3xl bg-slate-50 px-4 py-3 text-slate-700">
            Total de clientes: <strong>{clients.length}</strong>
          </div>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-8 shadow-lg shadow-slate-200/40">
        <div className="mb-8 flex gap-3">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar cliente por nome..."
            className="flex-1 rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
          />
          <button
            type="button"
            onClick={handleSearch}
            className="rounded-2xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Buscar
          </button>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              loadClients();
            }}
            className="rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Limpar
          </button>
        </div>

        {clients.length > 0 ? (
          <div className="overflow-hidden rounded-3xl border border-slate-200">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-6 py-4">Nome</th>
                  <th className="px-6 py-4">Data de cadastro</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id ?? client.name} className="border-t border-slate-200">
                    <td className="px-6 py-4 font-medium text-slate-900">{client.name}</td>
                    <td className="px-6 py-4">{client.created_at ? new Date(client.created_at).toLocaleDateString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center">
            <p className="text-slate-500">Nenhum cliente encontrado.</p>
          </div>
        )}
      </section>
    </div>
  );
}

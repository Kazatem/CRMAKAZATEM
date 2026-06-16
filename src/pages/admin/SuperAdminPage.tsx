import { useEffect, useState } from 'react';
import api from '../../api';

interface Empresa {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  status: string;
  valor_mensalidade: string;
  vendedor_crm: string;
  created_at: string;
}

interface Stats {
  total: number;
  ativas: number;
  mrr: string;
}

export default function SuperAdminPage() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nome: '', email: '', telefone: '' });

  useEffect(() => {
    api.get('/superadmin/empresas').then(r => setEmpresas(r.data));
    api.get('/superadmin/stats').then(r => setStats(r.data));
  }, []);

  async function handleCreate() {
    if (!form.nome || !form.email) return;
    const res = await api.post('/superadmin/empresas', form);
    setEmpresas(prev => [res.data, ...prev]);
    setShowForm(false);
    setForm({ nome: '', email: '', telefone: '' });
    api.get('/superadmin/stats').then(r => setStats(r.data));
  }

  async function handleStatus(id: number, status: string) {
    await api.put(`/superadmin/empresas/${id}`, { status });
    setEmpresas(prev => prev.map(e => e.id === id ? { ...e, status } : e));
    api.get('/superadmin/stats').then(r => setStats(r.data));
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-white p-8 shadow-lg shadow-slate-200/40">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-sm uppercase tracking-[0.35em] text-slate-500">Super Admin</span>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950">Painel de Assinantes</h2>
            <p className="mt-2 text-slate-500">Gerencie todas as empresas assinantes do Vertex Vendas.</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="rounded-2xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition"
          >
            + Nova empresa
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <article className="rounded-3xl bg-white p-6 shadow-lg shadow-slate-200/40">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Total de empresas</p>
          <p className="mt-4 text-3xl font-semibold text-slate-950">{stats?.total ?? 0}</p>
        </article>
        <article className="rounded-3xl bg-white p-6 shadow-lg shadow-slate-200/40">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Empresas ativas</p>
          <p className="mt-4 text-3xl font-semibold text-slate-950">{stats?.ativas ?? 0}</p>
        </article>
        <article className="rounded-3xl bg-white p-6 shadow-lg shadow-slate-200/40">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">MRR</p>
          <p className="mt-4 text-3xl font-semibold text-slate-950">R$ {stats?.mrr ?? '0.00'}</p>
          <p className="mt-1 text-sm text-slate-500">Receita mensal recorrente</p>
        </article>
      </div>

      {/* Formulário nova empresa */}
      {showForm && (
        <div className="rounded-3xl bg-white p-6 shadow-lg shadow-slate-200/40 space-y-4">
          <h3 className="text-lg font-semibold text-slate-950">Nova empresa assinante</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <input
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm"
              placeholder="Nome da empresa"
              value={form.nome}
              onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
            />
            <input
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm"
              placeholder="Email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            />
            <input
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm"
              placeholder="Telefone"
              value={form.telefone}
              onChange={e => setForm(f => ({ ...f, telefone: e.target.value }))}
            />
          </div>
          <div className="flex gap-3">
            <button onClick={handleCreate} className="rounded-2xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition">
              Criar empresa
            </button>
            <button onClick={() => setShowForm(false)} className="rounded-2xl border border-slate-200 px-6 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista de empresas */}
      <section className="rounded-3xl bg-white p-6 shadow-lg shadow-slate-200/40">
        <h3 className="text-xl font-semibold text-slate-950 mb-6">Empresas assinantes</h3>
        <div className="overflow-hidden rounded-3xl border border-slate-200">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-6 py-4">Empresa</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Valor</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {empresas.map(e => (
                <tr key={e.id} className="border-t border-slate-200">
                  <td className="px-6 py-4 font-medium text-slate-900">{e.nome}</td>
                  <td className="px-6 py-4">{e.email}</td>
                  <td className="px-6 py-4">R$ {e.valor_mensalidade}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                      e.status === 'ativo' ? 'bg-green-100 text-green-700' :
                      e.status === 'bloqueado' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {e.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {e.status !== 'ativo' && (
                        <button onClick={() => handleStatus(e.id, 'ativo')} className="rounded-xl bg-green-500 px-3 py-1 text-xs font-medium text-white hover:bg-green-400 transition">
                          Ativar
                        </button>
                      )}
                      {e.status !== 'bloqueado' && (
                        <button onClick={() => handleStatus(e.id, 'bloqueado')} className="rounded-xl bg-red-500 px-3 py-1 text-xs font-medium text-white hover:bg-red-400 transition">
                          Bloquear
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

import { useEffect, useState } from 'react';
import api from '../../api';
import type { User } from '../../types';

const emptyForm = { nome: '', email: '', senha: '', cargo: 'vendedor', ativo: true };

export default function AdminSellersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editUserId, setEditUserId] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/users')
      .then((response) => setUsers(response.data))
      .catch(() => setMessage('Não foi possível carregar a lista de vendedores.'));
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditUserId(null);
    setMessage('');
  };

  const handleSave = async () => {
    if (!form.nome || !form.email) {
      setMessage('Preencha nome e email.');
      return;
    }

    try {
      if (editUserId) {
        const response = await api.put(`/users/${editUserId}`, {
          nome: form.nome,
          email: form.email,
          cargo: form.cargo,
          ativo: form.ativo,
          senha: form.senha || undefined,
        });
        setUsers((current) => current.map((user) => (user.id === editUserId ? response.data : user)));
        setMessage('Vendedor atualizado com sucesso.');
        resetForm();
        return;
      }

      if (!form.senha) {
        setMessage('Informe a senha para um novo vendedor.');
        return;
      }

      const response = await api.post('/users', form);
      setUsers((current) => [response.data, ...current]);
      setMessage('Vendedor criado com sucesso.');
      resetForm();
    } catch {
      setMessage('Erro ao salvar vendedor. Tente novamente.');
    }
  };

  const handleEdit = (user: User) => {
    setEditUserId(user.id);
    setForm({ nome: user.name, email: user.email, senha: '', cargo: user.role, ativo: user.ativo ?? true });
    setMessage('Editando vendedor. Faça alterações e salve.');
  };

  const handleDelete = async (userId: number) => {
    try {
      await api.delete(`/users/${userId}`);
      setUsers((current) => current.map((user) => (user.id === userId ? { ...user, ativo: false } : user)));
      setMessage('Vendedor inativado com sucesso.');
    } catch {
      setMessage('Erro ao inativar vendedor. Tente novamente.');
    }
  };

  const sellers = users.filter((user) => user.role === 'vendedor');

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-8 shadow-lg shadow-slate-200/40">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">Vendedores</h2>
            <p className="mt-2 text-slate-500">Gerencie login, perfil e status dos vendedores do sistema.</p>
          </div>
          <div className="rounded-3xl bg-slate-50 px-4 py-3 text-slate-700">
            Vendedores ativos: <strong>{sellers.filter((user) => user.ativo).length}</strong>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_360px]">
          <div>
            <div className="overflow-hidden rounded-3xl border border-slate-200">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-700">
                  <tr>
                    <th className="px-6 py-4">Nome</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Cargo</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {sellers.map((user) => (
                    <tr key={user.id} className="border-t border-slate-200">
                      <td className="px-6 py-4 font-medium text-slate-900">{user.name}</td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4 capitalize">{user.role}</td>
                      <td className="px-6 py-4">{user.ativo ? 'Ativo' : 'Inativo'}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(user)}
                            className="rounded-2xl border border-slate-300 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(user.id)}
                            className="rounded-2xl border border-rose-300 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                          >
                            Inativar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="text-xl font-semibold text-slate-950">{editUserId ? 'Editar vendedor' : 'Novo vendedor'}</h3>
            <p className="mt-2 text-sm text-slate-500">Crie ou atualize um usuário com perfil de vendedor.</p>
            <div className="mt-6 space-y-4">
              <label className="block text-sm font-medium text-slate-700">Nome</label>
              <input
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                value={form.nome}
                onChange={(event) => setForm({ ...form, nome: event.target.value })}
              />
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <input
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
              />
              <label className="block text-sm font-medium text-slate-700">Senha</label>
              <input
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                type="password"
                value={form.senha}
                onChange={(event) => setForm({ ...form, senha: event.target.value })}
                placeholder={editUserId ? 'Deixe em branco para manter a senha atual' : ''}
              />
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex-1 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400"
                >
                  {editUserId ? 'Salvar alterações' : 'Criar vendedor'}
                </button>
                {editUserId ? (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    Cancelar
                  </button>
                ) : null}
              </div>
              {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

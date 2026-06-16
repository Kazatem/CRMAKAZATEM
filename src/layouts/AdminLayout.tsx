import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/adm/dashboard', label: 'Dashboard' },
  { to: '/adm/vendedores', label: 'Vendedores' },
  { to: '/adm/vendas', label: 'Vendas' },
  { to: '/adm/clientes', label: 'Clientes' },
  { to: '/adm/comissoes', label: 'Comissões' },
  { to: '/adm/relatorios', label: 'Relatórios' },
  { to: '/adm/metas', label: 'Metas' },
  { to: '/adm/configuracoes', label: 'Configurações' },
  { to: '/adm/inbox', label: 'Inbox Vendedores' },
  { to: '/adm/assinantes', label: 'Assinantes' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <div className="flex flex-col lg:flex-row">
        <aside className="w-full lg:w-72 bg-slate-950 text-slate-100 p-6">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Painel</p>
              <h1 className="text-2xl font-semibold">Admin CRM</h1>
            </div>
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-10 rounded-3xl border border-slate-800 bg-slate-900 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Usuário</p>
            <p className="mt-3 text-xl font-semibold">{user?.name}</p>
            <p className="text-sm text-slate-400">{user?.email}</p>
            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="mt-5 w-full rounded-2xl bg-teal-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-teal-400"
            >
              Sair
            </button>
          </div>
        </aside>

        <main className="flex-1 p-6 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

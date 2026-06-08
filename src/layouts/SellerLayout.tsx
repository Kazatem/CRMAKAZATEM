import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/vendedor/dashboard', label: 'Dashboard' },
  { to: '/vendedor/minhas-vendas', label: 'Minhas Vendas' },
  { to: '/vendedor/clientes', label: 'Clientes' },
  { to: '/vendedor/comissoes', label: 'Comissões' },
  { to: '/vendedor/metas', label: 'Metas' },
];

export default function SellerLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex flex-col lg:flex-row">
        <aside className="w-full lg:w-72 bg-slate-950 text-slate-100 p-6">
          <div className="mb-10">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Área do vendedor</p>
            <h1 className="text-2xl font-semibold">Vendedor CRM</h1>
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
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Vendedor</p>
            <p className="mt-3 text-xl font-semibold">{user?.name}</p>
            <p className="text-sm text-slate-400">{user?.email}</p>
            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="mt-5 w-full rounded-2xl bg-amber-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300"
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

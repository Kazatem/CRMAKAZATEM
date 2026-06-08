import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const { login, user, loading, error } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  useEffect(() => {
    if (user) {
      navigate(user.role === 'admin' ? '/adm/dashboard' : '/vendedor/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await login(email, senha);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-700 text-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-950 p-8 shadow-2xl shadow-slate-900/20">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Acesso ao CRM</p>
          <h1 className="mt-4 text-3xl font-semibold">Entrar no sistema</h1>
          <p className="mt-3 text-slate-400">Entre com seu email e senha para acessar sua área.</p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block space-y-2 text-sm font-medium text-slate-200">
            Email
            <input
              className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label className="block space-y-2 text-sm font-medium text-slate-200">
            Senha
            <input
              className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              type="password"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              required
            />
          </label>
          {error ? <div className="rounded-2xl bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div> : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Carregando...' : 'Entrar'}
          </button>
        </form>
        <div className="mt-6 flex items-center justify-between text-sm text-slate-400">
          <span>Esqueceu a senha?</span>
          <Link to="/forgot-password" className="font-semibold text-cyan-300 hover:text-cyan-200">
            Recuperar acesso
          </Link>
        </div>
      </div>
    </div>
  );
}

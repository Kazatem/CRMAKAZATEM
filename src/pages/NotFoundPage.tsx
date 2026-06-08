import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900 p-10 text-center shadow-2xl shadow-slate-950/40">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">404</p>
        <h1 className="mt-5 text-5xl font-semibold text-white">Página não encontrada</h1>
        <p className="mt-4 text-slate-400">A rota que você tentou acessar não existe ou não está disponível.</p>
        <Link
          to="/login"
          className="mt-8 inline-flex rounded-2xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
        >
          Voltar ao login
        </Link>
      </div>
    </div>
  );
}

import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    try {
      const response = await api.post('/auth/forgot-password', { email });
      setMessage(response.data.message);
      setSubmitted(true);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Não foi possível enviar o pedido.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl shadow-slate-950/20">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Recuperação</p>
          <h1 className="mt-4 text-3xl font-semibold">Esqueci minha senha</h1>
          <p className="mt-3 text-slate-400">Insira seu email para receber instruções de recuperação.</p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block space-y-2 text-sm font-medium text-slate-200">
            Email
            <input
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          {error ? <div className="rounded-2xl bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div> : null}
          {submitted ? <div className="rounded-2xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{message}</div> : null}
          <button type="submit" className="w-full rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
            Enviar instruções
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-slate-400">
          <Link to="/login" className="font-semibold text-cyan-300 hover:text-cyan-200">
            Voltar para login
          </Link>
        </div>
      </div>
    </div>
  );
}

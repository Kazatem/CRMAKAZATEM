export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-8 shadow-lg shadow-slate-200/40">
        <h2 className="text-2xl font-semibold text-slate-950">Configurações</h2>
        <p className="mt-2 text-slate-500">Ajuste parâmetros do CRM, controle de usuário e acessos.</p>
      </section>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/40">
          <h3 className="text-xl font-semibold text-slate-950">Segurança</h3>
          <p className="mt-3 text-slate-500">Reveja políticas de autenticação e recupere senha.</p>
          <div className="mt-6 rounded-3xl bg-slate-50 p-5">
            <p className="text-sm text-slate-600">JWT com sessão controlada para proteger rotas e impedir acessos indevidos.</p>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/40">
          <h3 className="text-xl font-semibold text-slate-950">Acesso</h3>
          <p className="mt-3 text-slate-500">Perfis configurados para administrador e vendedor.</p>
          <div className="mt-6 rounded-3xl bg-slate-50 p-5">
            <p className="text-sm text-slate-600">Administradores têm acesso total. Vendedores veem apenas seus dados.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

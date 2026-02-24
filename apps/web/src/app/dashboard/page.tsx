import { auth, signOut } from '@/auth';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <p className="text-zinc-400">Redirecionando para login...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-50">Painel Admin DARE-bot</h1>
        <div className="flex items-center gap-4">
          <span className="text-zinc-400">{session.user.email ?? session.user.name}</span>
          <form
            action={async () => {
              'use server';
              await signOut({ redirectTo: '/' });
            }}
          >
            <button
              type="submit"
              className="rounded-lg bg-zinc-700 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-600"
            >
              Sair
            </button>
          </form>
        </div>
      </header>
      <main className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
        <p className="text-zinc-400">
          Bem-vindo ao painel administrativo. Em breve: estatísticas, configurações de servidores e
          mais.
        </p>
      </main>
    </div>
  );
}

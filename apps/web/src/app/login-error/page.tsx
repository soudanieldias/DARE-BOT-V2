import Link from 'next/link';

type ErrorType = 'Configuration' | 'AccessDenied' | 'Verification' | 'Default';

const messages: Record<ErrorType, string> = {
  Configuration:
    'Erro de configuração. Confira no Discord Developer Portal se o Redirect URI está exatamente como abaixo e se o Client Secret está correto no .env do painel.',
  AccessDenied: 'Você cancelou o login ou não tem permissão.',
  Verification: 'O link de verificação expirou ou já foi usado.',
  Default: 'Ocorreu um erro ao fazer login.',
};

export default async function LoginErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const error = (params.error as ErrorType) || 'Default';
  const message = messages[error] ?? messages.Default;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-zinc-950 p-8">
      <h1 className="text-2xl font-bold text-red-400">Erro no login</h1>
      <p className="max-w-md text-center text-zinc-400">{message}</p>
      {error === 'Configuration' && (
        <code className="rounded bg-zinc-800 px-3 py-2 text-sm text-zinc-300">
          http://localhost:3000/api/auth/callback/discord
        </code>
      )}
      <Link
        href="/"
        className="rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-500"
      >
        Tentar novamente
      </Link>
    </div>
  );
}

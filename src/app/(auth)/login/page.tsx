'use client';

import { signIn } from 'next-auth/react';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm rounded-lg bg-white p-8 text-center shadow-md">
        <h1 className="mb-2 text-2xl font-bold">Lume People</h1>
        <p className="mb-6 text-gray-600">
          Acesse a plataforma para gerenciar sua equipe.
        </p>
        <button
          onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
          className="w-full rounded-lg bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none focus:shadow-outline"
        >
          Entrar com Google
        </button>
      </div>
    </div>
  );
} 
import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import LoginLoading from '@/components/auth/LoginLoading';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<LoginLoading />}>
        <LoginForm />
      </Suspense>
    </div>
  );
} 
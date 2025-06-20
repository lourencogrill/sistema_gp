import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          {children}
        </div>
      </body>
    </html>
  );
} 
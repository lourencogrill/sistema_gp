'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/financials';
  const error = searchParams.get('error');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState(error || '');
  const [loading, setLoading] = useState(false);
  
  // Ref para definir o foco automático no campo de e-mail
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Ao montar o componente, coloca o cursor no campo de e-mail
    emailInputRef.current?.focus();
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrorMessage(''); // Limpa mensagem de erro ao digitar
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);
    
    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });
      
      if (result?.error) {
        setErrorMessage(result.error);
        return;
      }
      
      router.push(redirectTo);
      router.refresh(); // Força atualização do estado da sessão
      
    } catch (err: any) {
      console.error('Erro no login:', err);
      setErrorMessage('Ocorreu um erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center font-bold">Bem-vindo</CardTitle>
        <CardDescription className="text-center">
          Entre com suas credenciais para acessar sua conta
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center mb-6">
            <AlertCircle className="h-4 w-4 mr-2" />
            <span className="text-sm">{errorMessage}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                ref={emailInputRef}
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                required
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                className="bg-white"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
                  Esqueceu a senha?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                className="bg-white"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </div>
        </form>
      </CardContent>
      
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-600">
          Não tem uma conta?{' '}
          <Link href="/register" className="text-blue-600 hover:text-blue-800 font-medium">
            Criar conta
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
} 
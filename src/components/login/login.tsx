'use client';

import useAuth from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@ui/buttons/button';
import { Input } from '@ui/inputs/input';
import { signIn, signOut } from 'next-auth/react';
import { redirectByRole } from '@utils/authFunctions';

const Login = () => {
  const { session } = useAuth();
  console.log("🚀 ~ Login ~ session:", session)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [whitelistedEmails, setWhitelistedEmails] = useState<string[]>([]);
  const [loginAttempted, setLoginAttempted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchWhitelistedEmails = async () => {
      try {
        const res = await fetch('/api/services/support');
        if (!res.ok) {
          throw new Error('Failed to fetch whitelisted emails');
        }
        const emails: string[] = await res.json();
        setWhitelistedEmails(emails);
      } catch (err) {
        console.error('Error fetching whitelisted emails:', err);
        setError('Error cargando correos permitidos. Por favor, intenta nuevamente.');
      }
    };

    fetchWhitelistedEmails();
  }, []);

  useEffect(() => {
    if (loginAttempted && session) {
      redirectByRole(session, router, setError, whitelistedEmails);
    }
  }, [session, loginAttempted, router, whitelistedEmails]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError('');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.endsWith('@finaersa.com.ar')) {
      return;
    }

    if (loading) return;
    setLoading(true);
    setLoginAttempted(true);

    try {
      if (session && email !== session.user.email) {
        await signOut({ redirect: false });
        setPassword('');
        setLoading(false);
        return;
      }

      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
        callbackUrl: '/support',
      });

      if (res?.ok) {
        const session = await fetch('/api/auth/session').then((res) => res.json());
        redirectByRole(session, router, setError, whitelistedEmails);
      }

    } catch (error) {
      console.error('Error durante el login:', error);
      setError('Ocurrió un error inesperado. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F2F2F2]">
      <div className="flex w-full max-w-7xl">
        <div className="w-1/2 flex items-center justify-start pl-1">
          <Image
            src="/images/finaer-logo.svg"
            alt="Finaer Logo"
            width={370}
            height={123}
            priority
          />
        </div>

        <div className="w-1/2 flex items-center justify-center">
          <div className="bg-white p-10 rounded-[25px] shadow-md w-full max-w-[700px] h-[800px] max-h-[900px] flex flex-col items-start justify-center">
            <h1 className="text-3xl text-black font-bold text-left">Bienvenido al</h1>
            <h1 className="text-3xl text-[#E30613] font-bold text-left mb-6">Sistema de control de Tickets</h1>
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-full items-start">
              <label htmlFor="email" className="text-lg text-left text-black">Correo electrónico</label>
              <Input
                id="email"
                type="email"
                placeholder="Correo"
                value={email}
                onChange={handleEmailChange}
                className="w-3/5 py-3 px-4 text-base border border-black ml-2"
              />
              {!session && (
                <>
                  <label htmlFor="password" className="text-lg text-left text-black">Contraseña</label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={handlePasswordChange}
                    className="w-3/5 py-3 px-4 text-base border border-black ml-2"
                  />
                </>
              )}
              {error && <p className="text-red-500 text-sm text-left">{error}</p>}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={loading || !email || (!password && !session)}
                  className={`ml-2 w-[200px] py-3 text-white text-lg rounded-full border ${loading || !email || (!password && !session) ? 'bg-gray-300' : 'bg-gradient-to-r from-[rgb(159,4,13)] to-[rgb(227,6,19)]'}`}
                >
                  {loading ? 'Validando...' : 'Entrar'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

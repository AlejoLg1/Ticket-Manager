'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@ui/buttons/button';
import { Input } from '@ui/inputs/input';

const Login = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const whitelistedEmails = ['admin@finaersa.com.ar', 'soporte@finaersa.com.ar', 'usuario@finaersa.com.ar'];

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.endsWith('@finaersa.com.ar')) {
      setError('Solo se puede iniciar sesión con correos del dominio @finaersa.com.ar.');
      return;
    }

    setLoading(true);

    try {
      if (whitelistedEmails.includes(email)) {
        router.push('/support'); 
      } else {
        router.push('/');
      }
    } catch {
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
                placeholder="Escribe aquí"
                value={email}
                onChange={handleEmailChange}
                className="w-3/5 py-3 px-4 text-base border border-black ml-2 "
              />
              {error && <p className="text-red-500 text-sm text-left">{error}</p>}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={loading || !email}
                  className={`ml-2 w-[200px] py-3 text-white text-lg rounded-full border ${loading || !email ? 'bg-gray-300' : 'bg-gradient-to-r from-[rgb(159,4,13)] to-[rgb(227,6,19)]'}`}
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

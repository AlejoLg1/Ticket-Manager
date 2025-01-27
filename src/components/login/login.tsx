'use client';

import useAuth from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@ui/buttons/button';
import { Input } from '@ui/inputs/input';
import { signIn } from 'next-auth/react';
import HouseLoader from '@/components/loader/houseLoader';

const Login = () => {
  const { session } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resending, setResending] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      if (session.user.role === 'support') {
        router.push('/support');
      } else {
        router.push('/');
      }
    }
  }, [session, router]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // if (!email.endsWith('@finaersa.com.ar')) {
    //   setError('Por favor, verifique sus credenciales.');
    //   return;
    // }

    if (loading) return;

    setLoading(true);
    await sendEmail();
    setLoading(false);
  };

  const handleResend = async () => {
    if (resending) return;

    setResending(true);
    await sendEmail();
    setResending(false);
  };

  const sendEmail = async () => {
    try {
      const createUserResponse = await fetch('/api/services/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const createUserData = await createUserResponse.json();

      if (!createUserData.success) {
        setError('No se pudo verificar o crear el usuario. Inténtalo nuevamente.');
        return;
      }

      const res = await signIn('email', {
        redirect: false,
        email,
      });

      if (res?.ok) {
        setError('');
        setSuccess(true);
      } else {
        setError('No se pudo enviar el correo de autenticación. Inténtalo nuevamente.');
      }
    } catch (error) {
      setError('Ocurrió un error inesperado. Por favor, intenta nuevamente.');
      console.error('Error en el proceso de login:', error);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F2F2F2]">
      <div className="flex flex-col lg:flex-row w-full max-w-7xl px-6 sm:px-8 md:px-12 gap-6">
        <div className="lg:w-1/2 flex items-center justify-center lg:justify-start">
          <Image
            src="/images/finaer-logo.svg"
            alt="Finaer Logo"
            width={370}
            height={123}
            priority
          />
        </div>

        <div className="lg:w-1/2 w-full flex items-center justify-center">
          <div className="bg-white p-6 sm:p-8 md:p-10 rounded-[25px] shadow-md w-full max-w-[700px] h-auto sm:h-[400px] lg:h-[700px] flex flex-col items-center justify-center">
            {loading ? (
              <div className="flex flex-col items-center justify-center">
                <HouseLoader />
              </div>
            ) : success ? (
              <div className="text-center flex flex-col items-center">
                {resending ? (
                  <div className="flex flex-col items-center">
                    <HouseLoader />
                  </div>
                ) : (
                  <>
                    <p className="text-lg text-black">
                      ¡Correo de autenticación enviado! Revisa tu bandeja de entrada.
                    </p>
                    <p className="text-lg text-black mt-4">Puedes cerrar esta pestaña.</p>
                    <button
                      onClick={handleResend}
                      disabled={resending}
                      className="mt-8"
                    >
                      <span className="text-lg text-white px-4 py-2 rounded-full bg-gradient-to-r from-[rgb(159,4,13)] to-[rgb(227,6,19)] hover:from-[#B01E0D] hover:to-[#B01E0D]">
                        Enviar de nuevo
                      </span>
                    </button>
                  </>
                )}
              </div>
            ) : (
              <>
                <h1 className="w-full text-3xl text-black font-bold text-left">
                  Bienvenido al
                </h1>
                <h1 className="w-full text-3xl text-[#E30613] font-bold text-left mb-6">
                  Sistema de Control de Tickets
                </h1>
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col space-y-4 w-full items-start"
                >
                  <label htmlFor="email" className="text-lg text-left text-black">
                    Correo electrónico
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Correo"
                    value={email}
                    onChange={handleEmailChange}
                    className="lg:w-3/5 sm:w-full py-3 px-4 text-base border border-black ml-2"
                  />
                  {error && (
                    <p className="text-red-500 text-sm text-left">{error}</p>
                  )}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={loading || !email}
                      className={`ml-2 w-[200px] py-3 text-white text-lg rounded-full border ${
                        loading || !email
                          ? 'bg-gray-300'
                          : 'bg-gradient-to-r from-[rgb(159,4,13)] to-[rgb(227,6,19)] hover:from-[#B01E0D] hover:to-[#B01E0D]'
                      }`}
                    >
                      Entrar
                    </Button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

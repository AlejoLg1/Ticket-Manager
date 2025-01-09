import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react';
import { Session } from 'next-auth';

export const redirectByRole = (
  session: Session | null,
  router: ReturnType<typeof useRouter>,
  setError: Dispatch<SetStateAction<string>>,
  whitelistedEmails: string[]
) => {
  if (!session || !session.user) {
    setError('No tienes permisos para acceder a esta aplicación.');
    return;
  }

  const { role, email } = session.user;

  if (whitelistedEmails.includes(email) && role === 'support') {
    router.push('/support');
  } else if (role === 'user' && !whitelistedEmails.includes(email)) {
    router.push('/');
  } else {
    setError('No tienes permisos para acceder a esta aplicación.');
  }
};
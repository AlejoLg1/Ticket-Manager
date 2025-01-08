import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react';

export const redirectByRole = (
  userRole: string | undefined,
  email: string,
  router: ReturnType<typeof useRouter>,
  setError: Dispatch<SetStateAction<string>>,
  whitelistedEmails: string[]
) => {

  if (!userRole) {
    setError('No tienes permisos para acceder a esta aplicación.');
    return;
  }

  if (whitelistedEmails.includes(email) && userRole === 'support') {
    router.push('/support');
  } else if (userRole === 'user' && !whitelistedEmails.includes(email)) {
    router.push('/');
  } else {
    setError('No tienes permisos para acceder a esta aplicación.');
  }
};

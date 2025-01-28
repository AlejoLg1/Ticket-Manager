export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    throw ('Error copying text to clipboard');
  }
};


export const getCurrentDateTime = (): string => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();
  
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };


export const getVariableByEnv = (variable: string): string | undefined => {
  const isProduction = process.env.NODE_ENV === 'production';
  const prefix = isProduction ? 'PRD_' : 'DEV_';
  const envVariable = process.env[`${prefix}${variable}`];

  if (!envVariable) {
    console.warn(`Environment variable ${prefix}${variable} is not defined`);
  }

  return envVariable;
};

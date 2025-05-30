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


  export const getVariableByEnv = (key: string): string | undefined => {
    const vercelEnv = process.env.VERCEL_ENV;
  
    let envPrefix = 'DEV';
  
    if (vercelEnv === 'production') {
      envPrefix = 'PRD';
    } else if (vercelEnv === 'preview') {
      envPrefix = 'PREVIEW';
    }
  
    const variableKey = `${envPrefix}_${key}`;
    return process.env[variableKey];
  };
  
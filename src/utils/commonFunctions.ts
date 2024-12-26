export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error copying text to clipboard: ${error.message}`);
    } else {
      throw new Error('Error copying text to clipboard: unknown error');
    }
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
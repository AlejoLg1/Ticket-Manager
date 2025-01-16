export interface FileDetails {
    name: string;
    url: string;
    downloadUrl: string;
    size: number;
    uploadedAt: string;
}
  
export interface EyeToggleProps {
    ticketId: string;
    fill?: string;
    size?: number;
}
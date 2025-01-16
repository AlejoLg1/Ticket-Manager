import { NextRequest, NextResponse } from 'next/server';
import { put, list } from '@vercel/blob';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const fileName = formData.get('fileName') as string;
    const fileContent = formData.get('fileContent') as Blob;
    const ticketNumber = formData.get('ticketNumber') as string;

    if (!fileName || !fileContent || !ticketNumber) {
      throw new Error('fileName, fileContent o ticketNumber están ausentes.');
    }

    const organizedFileName = `${ticketNumber}/${fileName}`;

    const { url } = await put(organizedFileName, fileContent, {
      access: 'public',
    });

    return NextResponse.json({ success: true, url });
  } catch (error) {
    console.error('Error subiendo archivo:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ticketNumber = searchParams.get('ticketNumber');

    if (!ticketNumber) {
      throw new Error('El parámetro "ticketNumber" es obligatorio.');
    }

    const prefix = `${ticketNumber}/`;

    const { blobs } = await list({
      prefix,
      limit: 1000,
    });

    if (!blobs || blobs.length === 0) {
      return NextResponse.json({
        success: true,
        files: [],
        message: `No se encontraron archivos para el ticket: ${ticketNumber}`,
      });
    }

    const files = blobs.map((blob) => ({
      name: blob.pathname.replace(`${ticketNumber}/`, ''), 
      url: blob.url,
      downloadUrl: blob.downloadUrl,
      size: blob.size,
      uploadedAt: blob.uploadedAt,
    }));

    return NextResponse.json({ success: true, files });
  } catch (error) {
    console.error('Error obteniendo archivos del ticket:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}




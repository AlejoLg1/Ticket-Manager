export function createMagicLinkEmail({ url, host }: { url: string; host: string }) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f9f9f9;
              margin: 0;
              padding: 0;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #fff;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .button {
              display: inline-block;
              margin-top: 20px;
              padding: 10px 20px;
              background-color: #e30613;
              color: #fff;
              text-decoration: none;
              border-radius: 4px;
              font-weight: bold;
            }
            .button:hover {
              background-color: #c20511;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Bienvenido al sistema de control de tickets</h1>
            <p>Haz clic en el siguiente enlace para acceder a tu cuenta:</p>
            <a class="button" href="${url}" target="_blank">Acceder</a>
            <p>Si no solicitaste este correo, ignóralo.</p>
            <p>Saludos,<br />El equipo de ${host}</p>
          </div>
        </body>
      </html>
    `;
  }
  
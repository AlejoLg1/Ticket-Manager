export function createMagicLinkEmail({ url }: { url: string }) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body,
        html {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          font-family: 'Montserrat', Arial, sans-serif;
          background-color: #f9f9f9;
        }

        table {
          border-spacing: 0;
          border-collapse: collapse;
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
        }

        img {
          display: block;
          width: 100%;
          height: auto;
          border: 0;
        }

        td {
          vertical-align: top;
          text-align: left;
        }

        .content {
          padding: 20px;
          background-color: #ffffff;
          text-align: center;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .button {
          display: inline-block;
          margin-top: 20px;
          padding: 15px 30px;
          background-color: #e30613;
          color: #fff !important; /* Fuerza texto blanco en todos los estados */
          text-decoration: none;
          border-radius: 24px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
        }

        .button:link,
        .button:visited,
        .button:hover,
        .button:active {
          color: #fff !important; /* Asegura que el texto siempre sea blanco */
          text-decoration: none; /* Elimina subrayado */
        }

        .button:hover {
          background-color: #c20511;
        }

        .footer {
          background-color: #dcf2fa;
          text-align: center;
          padding: 20px;
          font-size: 12px;
          color: #4a4a49;
        }

        .footer p {
          margin: 5px 0;
        }

        .footer a {
          color: #e30613;
          text-decoration: none;
        }

        .footer a:hover {
          text-decoration: underline;
        }

        .social-icons img {
          width: 20px;
          height: 20px;
          margin: 0 5px;
        }
      </style>
    </head>

    <body>
      <table>
        <tr>
          <td style="text-align: center; padding: 10px;">
            <img src="https://public-assets-finaeresp.s3.eu-west-3.amazonaws.com/finaer.png" alt="Logo" style="max-width: 150px; margin: auto;">
          </td>
        </tr>
        <tr>
          <td class="content">
            <h1 style="color: #101d3e; font-size: 24px; font-weight: 700;">¡Bienvenido al Sistema de Control de Tickets!</h1>
            <p style="color: #333; font-size: 16px;">Haz clic en el siguiente enlace para acceder a tu cuenta tu cuenta:</p>
            <a href="${url}" target="_blank" class="button">Acceder</a>
            <p style="color: #333; font-size: 14px;">Si no solicitaste este correo, ignóralo.</p>
          </td>
        </tr>
        <tr>
          <td class="footer">
            <p>¿Tienes alguna duda?</p>
            <p>Ponte en contacto con <a href="mailto:lucasa@finaer.es">lucasa@finaer.es</a> </p>

            <br>
            <p>Copyright © 2025 Finaer</p>
            <p style="font-size: 10px;">
              Este correo es estrictamente confidencial. Si no eres el destinatario, comunícalo al remitente y elimínalo.
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

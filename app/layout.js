import './globals.css';

export const metadata = {
  title: 'RescueVet',
  description: 'El historial médico digital universal para tu mascota en Perú.',
  keywords: 'veterinaria, mascotas, vacunas, QR, Perú, historial médico, perros, gatos',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🐾</text></svg>" />
      </head>
      <body>{children}</body>
    </html>
  );
}

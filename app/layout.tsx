import './globals.css';

export const metadata = {
  title: 'Pasaporte - Summit Empresarial 2026',
  description: 'Pasaporte digital para la feria de empresas.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
import '../src/index.css';
import ClientLayout from './client-layout';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>MediCore - Intelligent Healthcare Management</title>
        <meta name="description" content="Revolutionizing patient care through AI-powered diagnostics and comprehensive health monitoring." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
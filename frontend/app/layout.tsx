import { AuthProvider } from '@/context/AuthProvider';
import QueryProvider from '@/lib/providers/QuerryProviders';
import NextAuthProvider from '@/providers/NextAuthProvider';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background">
        <NextAuthProvider>
          <QueryProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </QueryProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}

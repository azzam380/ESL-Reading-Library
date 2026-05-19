import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../hooks/useAuth';
import { SchoolProvider } from '../hooks/useSchool';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Progressive English Learning Library',
  description: 'Premium multi-school SaaS ESL reading library platform for students and teachers.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased dark`}
    >
      <body className="min-h-full bg-slate-950 text-slate-100 font-sans flex flex-col antialiased">
        <AuthProvider>
          <SchoolProvider>
            {children}
          </SchoolProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

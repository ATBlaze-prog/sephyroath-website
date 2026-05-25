import type { Metadata } from 'next';
import '@/styles/globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ParticleCanvas from '@/components/sections/ParticleCanvas';
import AuthProvider from '@/providers/AuthProvider'; // 1. Imported safely


export const metadata: Metadata = {
  title: 'SephyrOath Gaming - Bound by Oath. Guided by Honor.',
  description:
    'A premium esports community management platform for SephyrOath Gaming. Join our competitive teams, participate in tournaments, and build your legacy.',
  keywords: ['gaming', 'esports', 'community', 'clan', 'competitive'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'SephyrOath Gaming Platform',
    description: 'Join the SephyrOath Gaming Community',
    siteName: 'SephyrOath',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* 2. Authentication Provider safely wraps the layout framework */}
        <AuthProvider>
          <ParticleCanvas />
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
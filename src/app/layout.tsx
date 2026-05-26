import type { Metadata } from 'next';
import '@/styles/globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ParticleCanvas from '@/components/sections/ParticleCanvas';
import AuthProvider from '@/providers/AuthProvider'; // 1. Imported safely


export const metadata: Metadata = {
  title: 'SephyrOath Gaming | Official Clan Website',
  description: 'Official website of SephyrOath Gaming.',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: [
      { rel: 'icon', url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { rel: 'icon', url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { rel: 'icon', url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { rel: 'icon', url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  keywords: ['gaming', 'esports', 'community', 'clan', 'competitive'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'SephyrOath Gaming | Official Clan Website',
    description: 'Official website of SephyrOath Gaming.',
    siteName: 'SephyrOath Gaming',
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
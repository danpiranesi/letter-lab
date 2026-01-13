import type { Metadata } from 'next';
import './globals.css';
import { defaultConfig } from '@/config/defaults';

export const metadata: Metadata = {
  title: defaultConfig.title,
  description: 'A beautiful letter writing application',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=Just+Another+Hand&family=Yomogi&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

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
      <body>{children}</body>
    </html>
  );
}


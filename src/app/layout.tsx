import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Wall Calendar — Interactive Date Picker',
  description: 'A beautifully crafted interactive wall calendar component with date range selection, notes, and responsive design.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

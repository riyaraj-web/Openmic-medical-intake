/* app/layout.tsx - Root layout file for the app */

import type { Metadata } from 'next';
import './globals.css'; // Import global styles (relative to app/)

export const metadata: Metadata = {
  title: 'OpenMic Medical Intake Dashboard',
  description: 'AI Intake Agent Management and Logs',
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
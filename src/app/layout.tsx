import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Todo List App',
  description: 'A modern, feature-rich todo list application built with Next.js and TypeScript',
  keywords: ['todo', 'task manager', 'productivity', 'next.js', 'react'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {children}
        </div>
      </body>
    </html>
  );
}
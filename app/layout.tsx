import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StarsBackground } from '@/components/animate-ui/components/backgrounds/stars';
import { cn } from '@/lib/utils';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Anveshana - 3D Exoplanet Explorer",
  description: "Interactive 3D visualization of exoplanets and star systems",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-black">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased relative min-h-screen`}>
        <StarsBackground
          starColor={'#FFF'}
          className={cn(
            'pointer-events-none fixed inset-0 z-0',
            'bg-[radial-gradient(ellipse_at_bottom,_#262626_0%,_#000_100%)]',
          )}
        />
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}

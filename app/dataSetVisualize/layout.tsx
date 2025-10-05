import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Anveshana - AI-Powered Exoplanet Discovery Platform | Built with AI Assistance',
  description: 'AI-created exoplanet discovery platform built with the help of artificial intelligence. Discover exoplanets beyond our solar system using advanced AI analysis and interactive 3D visualization. This AI-assisted platform features machine learning models trained on NASA satellite data from Kepler, K2, and TESS missions for the NASA Space Apps Challenge 2025.',
  keywords: [
    'AI-created platform',
    'AI-assisted development',
    'AI-built website',
    'exoplanets',
    'AI',
    'machine learning',
    'NASA',
    'space exploration',
    'artificial intelligence development',
    'AI-powered creation',
    'Kepler',
    'TESS',
    'K2',
    'exoplanet discovery',
    'artificial intelligence',
    'space telescope',
    'planetary science',
    'astronomy',
    'data visualization',
    '3D visualization',
    'transit detection',
    'NASA Space Apps Challenge',
    'neural networks',
    'space apps 2025',
    'AI-generated content',
    'AI collaboration'
  ],
  authors: [{ name: 'Muhammad Tayyab with AI Assistance', url: 'https://github.com/TayyabXtreme' }],
  creator: 'Muhammad Tayyab (AI-Assisted Development)',
  publisher: 'AI Anveshana',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ai-anveshana.vercel.app',
    siteName: 'AI Anveshana',
    title: 'AI Anveshana - AI-Created Exoplanet Discovery Platform',
    description: 'AI-assisted exoplanet discovery platform created with artificial intelligence. Features AI analysis trained on NASA satellite data for space exploration.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AI Anveshana - AI-Created Exoplanet Discovery Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Anveshana - AI-Created Exoplanet Discovery Platform',
    description: 'AI-assisted platform for discovering exoplanets using machine learning trained on NASA satellite data. Built with AI collaboration.',
    images: ['/og-image.jpg'],
    creator: '@TayyabXtreme',
  },
  alternates: {
    canonical: 'https://ai-anveshana.vercel.app',
  },
  category: 'science',
  classification: 'AI-created space exploration platform',
};

interface DataSetVisualizeLayoutProps {
  children: React.ReactNode;
}

export default function LandingLayout({ children }: DataSetVisualizeLayoutProps) {
  return <>{children}</>;
}
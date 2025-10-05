'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FloatingDock } from '@/components/ui/floating-dock';
import { Badge } from '@/components/ui/badge';
import { Home, ArrowLeft, Satellite, Telescope, Activity } from 'lucide-react';

const satellites = [
  {
    name: 'Kepler',
    path: '/kepler',
    icon: <Telescope className="h-4 w-4" />,
    color: 'from-green-400 to-emerald-500'
  },
  {
    name: 'K2',
    path: '/k2',
    icon: <Activity className="h-4 w-4" />,
    color: 'from-blue-400 to-cyan-500'
  },
  {
    name: 'TESS',
    path: '/tess',
    icon: <Satellite className="h-4 w-4" />,
    color: 'from-purple-400 to-violet-500'
  }
];

export default function SatelliteNavbar() {
  const router = useRouter();
  const pathname = usePathname();

  const dockItems = [
    { title: 'Home', icon: <Home className="h-4 w-4" />, href: '/' },
    ...satellites.map(s => ({ title: s.name, icon: s.icon, href: s.path })),
  ];

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 bg-transparent py-4">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          <div className="hidden md:block" />
          <FloatingDock
            items={dockItems}
            desktopClassName="max-w-lg"
            mobileClassName="fixed bottom-6 left-1/2 -translate-x-1/2"
          />
          <div className="hidden md:block" />
        </div>
      </div>
    </nav>
  );
}
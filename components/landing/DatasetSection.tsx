'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { WobbleCard } from '@/components/ui/wobble-card';
import {
  Database,
  ArrowRight,
  BarChart3,
  Filter,
  Search,
  Globe,
  Eye,
  Layers,
  Zap,
  Star
} from 'lucide-react';

const features = [
  {
    icon: <Search className="h-6 w-6" />,
    title: 'Advanced Search',
    description: 'Filter by size, temperature, host star type, and orbital characteristics'
  },
  {
    icon: <Globe className="h-6 w-6" />,
    title: '3D Visualization',
    description: 'Interactive 3D galaxy view with thousands of exoplanets positioned accurately'
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: 'Data Analytics',
    description: 'Comprehensive statistics and trends across multiple discovery missions'
  },
  {
    icon: <Layers className="h-6 w-6" />,
    title: 'Multi-Mission Data',
    description: 'Unified dataset from Kepler, K2, and TESS space telescope missions'
  }
];

const stats = [
  { label: 'Total Exoplanets', value: '1,500+', icon: <Database className="h-5 w-5" /> },
  { label: 'Confirmed Planets', value: '580+', icon: <Star className="h-5 w-5" /> },
  { label: 'Discovery Methods', value: '3', icon: <Search className="h-5 w-5" /> }
];

export default function DatasetSection() {
  const router = useRouter();

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Dark Space-time Background */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-black to-slate-900"></div>

        {/* Flowing wave patterns */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-blue-900/10 to-transparent transform -skew-y-12 translate-y-20"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-purple-900/10 to-transparent transform skew-y-6 -translate-y-10"></div>
        </div>

        {/* Cosmic dust effect */}
        <div className="absolute inset-0">
          {Array.from({ length: 30 }).map((_, i) => {
            // Use deterministic values based on index to avoid hydration issues
            const leftPos = (i * 13) % 100;
            const topPos = (i * 17) % 100;
            const width = 1 + ((i % 3) + 1);
            const height = 1 + ((i % 4) + 1);
            const duration = 5 + ((i % 10) + 1);
            const delay = (i % 5);

            return (
              <div
                key={i}
                className="absolute rounded-full bg-white opacity-10"
                style={{
                  left: `${leftPos}%`,
                  top: `${topPos}%`,
                  width: `${width}px`,
                  height: `${height}px`,
                  animation: `float ${duration}s ease-in-out infinite`,
                  animationDelay: `${delay}s`,
                }}
              />
            );
          })}
        </div>

        {/* Subtle nebula glow */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 bg-slate-900/60 text-slate-300 border-slate-700/50 backdrop-blur-sm">
            <Database className="h-4 w-4 mr-2" />
            Dataset Explorer
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
            Explore the Universe
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-6">
            Dive into our comprehensive exoplanet database. Visualize and analyze confirmed worlds beyond our solar system.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, index) => (
            <WobbleCard
              key={index}
              containerClassName={cn(
                'min-h-[180px] bg-gradient-to-br',
                index === 0 && 'from-blue-900 to-indigo-900',
                index === 1 && 'from-purple-900 to-fuchsia-900',
                index === 2 && 'from-emerald-900 to-teal-900'
              )}
              className="py-10"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-3">
                  <div className="p-3 bg-white/10 rounded-xl border border-white/20 backdrop-blur-sm inline-flex">
                    <span className="text-white/80">{stat.icon}</span>
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-white/80">{stat.label}</div>
              </div>
            </WobbleCard>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left: Features Grid */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">Platform Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex flex-col py-4 relative group/feature border border-slate-800 rounded-lg bg-black/30 backdrop-blur-lg",
                    (index === 0 || index === 4) && "md:border-l",
                    index < 4 && "md:border-b"
                  )}
                >
                  {index < 4 && (
                    <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-900/40 to-transparent pointer-events-none rounded-lg" />
                  )}
                  {index >= 4 && (
                    <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-900/40 to-transparent pointer-events-none rounded-lg" />
                  )}
                  <div className="mb-2 relative z-10 px-4 text-neutral-400">
                    {feature.icon}
                  </div>
                  <div className="text-sm font-semibold mb-1 relative z-10 px-4">
                    <div className="absolute left-0 inset-y-0 h-4 group-hover/feature:h-5 w-1 rounded-tr-full rounded-br-full bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
                    <span className="group-hover/feature:translate-x-1 transition duration-200 inline-block text-white">
                      {feature.title}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300 max-w-xs relative z-10 px-4 pb-2">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: CTA Section */}
          <div className="text-center lg:text-left">
            <Card className="bg-black/30 border-slate-800/50 overflow-hidden backdrop-blur-lg hover:bg-black/40 transition-all duration-500">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-blue-500/15 rounded-xl border border-blue-500/30 backdrop-blur-sm">
                    <Database className="h-7 w-7 text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-white">
                      Interactive Explorer
                    </CardTitle>
                    <p className="text-blue-200 text-sm">3D visualization platform</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-300 leading-relaxed text-sm">
                  Experience our 3D visualization platform with confirmed exoplanets.
                  Filter by discovery method and planetary characteristics to uncover patterns across the galaxy.
                </p>

                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <Filter className="h-4 w-4 text-blue-400" />
                    Advanced filtering capabilities
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <Globe className="h-4 w-4 text-purple-400" />
                    Interactive 3D positioning
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <BarChart3 className="h-4 w-4 text-green-400" />
                    Data analytics and insights
                  </div>
                </div>

                <div className="flex">
                  <button
                    type="button"
                    className="relative flex rounded-full border content-center bg-black/20 hover:bg-black/10 transition duration-500 dark:bg-white/20 items-center flex-row gap-2 h-min justify-center overflow-visible p-px decoration-clone w-full cursor-pointer"
                    onClick={() => router.push('/dataSetVisualize')}
                  >
                    <div className="w-full text-white z-10 bg-black px-6 py-3 rounded-full text-base text-center">
                      Explore Dataset
                      <span className="inline-block ml-2 align-middle">→</span>
                    </div>
                    <div className="bg-black absolute z-1 inset-[2px] rounded-[100px]" />
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CSS for floating animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(1deg); }
          66% { transform: translateY(5px) rotate(-1deg); }
        }
      `}</style>
    </section>
  );
}
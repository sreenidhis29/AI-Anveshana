'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import {
  Star,
} from 'lucide-react';

const missions = [
  {
    id: 'kepler',
    name: 'Kepler',
    subtitle: 'ML Transit Detection',
    description: 'AI models trained on transit light curves for exoplanet classification.',
    route: '/kepler',
    period: '2009-2013',
    discoveries: '2,600+',
    status: 'Trained',
    image: '/kepler.jpeg',
    color: 'from-green-400 to-emerald-500',
    borderColor: 'border-green-400/20',
    bgColor: 'bg-green-400/5',
    highlights: [' XGBoost Model', 'Gemini']
  },
  {
    id: 'k2',
    name: 'K2',
    subtitle: 'Extended ML Pipeline',
    description: 'Advanced neural networks for multi-field exoplanet prediction.',
    route: '/k2',
    period: '2014-2018',
    discoveries: '500+',
    status: 'Trained',
    image: '/k2.jpg',
    color: 'from-blue-400 to-cyan-500',
    borderColor: 'border-blue-400/20',
    bgColor: 'bg-blue-400/5',
    highlights: ['XGBoost Model', 'Gemini']
  },
  {
    id: 'tess',
    name: 'TESS',
    subtitle: 'Real-time AI Analysis',
    description: 'Live machine learning predictions on all-sky survey data.',
    route: '/tess',
    period: '2018-Present',
    discoveries: '7,000+',
    status: 'Active',
    image: '/tesss.jpg',
    color: 'from-purple-400 to-violet-500',
    borderColor: 'border-purple-400/20',
    bgColor: 'bg-purple-400/5',
    highlights: ['LGBM Model', 'Gemini']
  }
];

export default function SatelliteSection() {
  const router = useRouter();
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <section id="missions" className="py-20 bg-gradient-to-b from-black via-slate-950 to-black relative overflow-hidden">
      {/* Space Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900/20 via-transparent to-transparent"></div>
        {/* Animated Stars */}
        {Array.from({ length: 50 }).map((_, i) => {
          // Use deterministic values based on index to avoid hydration issues
          const leftPos = (i * 7) % 100;
          const topPos = (i * 11) % 100;
          const delay = (i % 6) * 0.5;
          const duration = 2 + ((i % 3) + 1);

          return (
            <div
              key={i}
              className="absolute w-0.5 h-0.5 bg-white rounded-full animate-pulse"
              style={{
                left: `${leftPos}%`,
                top: `${topPos}%`,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
              }}
            />
          );
        })}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 bg-slate-900/80 text-slate-300 border-slate-700/50 backdrop-blur-sm">
            <Star className="h-4 w-4 mr-2" />
            AI Models
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
            Machine Learning Analysis
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Advanced AI models trained on satellite data for exoplanet detection and prediction.
          </p>
        </div>

        {/* Mission Cards */}
        <div className="grid lg:grid-cols-3 gap-6">
          {missions.map((mission) => {
            const isActive = activeId === mission.id;
            return (
              <div
                key={mission.id}
                className={`group relative flex flex-col justify-between rounded-xl w-full h-[460px] overflow-hidden border transition-all duration-300 
                bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:shadow-2xl hover:shadow-blue-500/10 ${isActive ? 'ring-2 ring-blue-400/40 scale-[1.01]' : ''}`}
              >
                {/* Header */}
                <div className="relative bg-clip-border mt-6 mx-4 rounded-xl h-72 overflow-hidden shadow-[0_10px_15px_-3px_rgba(59,130,246,.15),_0_4px_6px_-4px_rgba(59,130,246,.15)]">
                  <Image
                    src={mission.image}
                    alt={mission.name}
                    fill
                    className="object-cover"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-tr ${mission.color} opacity-20`}></div>
                </div>

                {/* Info */}
                <div className="border-0 p-6 text-center">
                  <p className="text-white font-semibold text-xl mb-2">{mission.name}</p>
                  <p className="text-slate-400 text-sm mb-1">{mission.subtitle}</p>
                  <p className="text-slate-300 text-sm">{mission.description}</p>
                </div>

                {/* Footer */}
                <div className="px-3 py-3 border border-slate-800 flex items-center justify-between bg-slate-900/60">
                  <p className="font-light text-[0.75rem] text-slate-400">{mission.highlights.join(' • ')}</p>
                  <button
                    type="button"
                    className={`select-none border-0 outline-0 text-white uppercase font-bold text-[0.75rem] px-3 py-2 rounded-md transition-all duration-200 cursor-pointer 
                  bg-slate-800 hover:bg-slate-700 shadow-[0_4px_6px_-1px_rgba(59,130,246,.15),_0_2px_4px_-2px_rgba(59,130,246,.15)] ${isActive ? 'scale-105' : ''}`}
                    onClick={() => {
                      setActiveId(mission.id);
                      setTimeout(() => router.push(mission.route), 180);
                    }}
                  >
                    AI Analysis
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-slate-500 mb-4 text-sm">
            Experience advanced machine learning predictions
          </p>
          <div className="flex justify-center">
            <button
              type="button"
              className="relative flex rounded-full border content-center bg-black/20 hover:bg-black/10 transition duration-500 dark:bg-white/20 items-center flex-row gap-2 h-min justify-center overflow-visible p-px decoration-clone w-fit cursor-pointer"
              onClick={() => router.push('/dataSetVisualize')}
            >
              <div className="w-auto text-white z-10 bg-black px-6 py-3 rounded-full text-base">
                Explore Current Satellites
                <span className="inline-block ml-2 align-middle">→</span>
              </div>
              <div className="bg-black absolute z-1 inset-[2px] rounded-[100px]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
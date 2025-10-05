'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { StarsBackground } from '@/components/animate-ui/components/backgrounds/stars';
import { cn } from '@/lib/utils';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import Image from 'next/image';

export default function HeroSection() {
  const router = useRouter();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Glass Top Bar */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-5 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-2xl px-8 py-5 shadow-[0_12px_40px_rgba(0,0,0,0.35)] min-w-[360px]">
          <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-black/30">
            <Image src="/COMIC CODERS.png" alt="Cosmic Coders" fill className="object-contain" />
          </div>
          <div className="overflow-hidden">
            <div className="flex items-baseline gap-2 whitespace-nowrap">
              <span className="text-sm md:text-base text-white/80">NASA Space Apps Challenge</span>
              <span className="text-base md:text-lg font-semibold text-white">2025</span>
            </div>
          </div>
        </div>
      </div>
      {/* Stars Background */}
      <StarsBackground
        starColor={'#FFF'}
        className={cn(
          'absolute inset-0 flex items-center justify-center rounded-none',
          'bg-[radial-gradient(ellipse_at_bottom,_#262626_0%,_#000_100%)]',
        )}
      />

      <div className="container mx-auto px-6 flex flex-col items-center justify-center text-center min-h-screen">
        {/* Hero Content */}
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Badge */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Badge variant="secondary" className="bg-slate-900/50 text-slate-300 border-slate-700 px-4 py-2 text-sm backdrop-blur-sm">

              <Sparkles className="h-4 w-4 mr-2" />

              Cosmic X Coders
            </Badge>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <motion.span
              className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent whitespace-nowrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              AI Anveshana
            </motion.span>
          </motion.h1>

          {/* Description */}
          <motion.p
            className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
          >
            Journey through the cosmos and discover exoplanets beyond our solar system using advanced AI analysis and interactive visualization.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <HoverBorderGradient
                containerClassName="rounded-full mx-auto cursor-pointer"
                as="button"
                className="bg-black text-white flex items-center space-x-2 px-8 py-4 text-lg"
                onClick={() => router.push('/dataSetVisualize')}
              >
                <span>Start Exploring</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="h-5 w-5" />
                </motion.div>
              </HoverBorderGradient>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}


'use client';

import Image from 'next/image';
import { ASSETS } from '@/lib/assets';

interface HeroBannerProps {
  title?: string;
  subtitle?: string;
  height?: string;
}

export default function HeroBanner({
  title = 'SephyrOath Gaming',
  subtitle = 'Bound by Oath. Guided by Honor. United as One.',
  height = 'h-96',
}: HeroBannerProps) {
  return (
    <div className={`relative w-full ${height} overflow-hidden rounded-lg`}>
      {/* Banner Image */}
      <Image
        src={ASSETS.BANNER}
        alt="SephyrOath Banner"
        fill
        className="object-cover brightness-50"
        priority
      />

      {/* Overlay Content */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-so-dark/80 flex flex-col justify-end p-8">
        <h2 className="text-4xl md:text-5xl font-bold text-so-gold mb-2">{title}</h2>
        <p className="text-so-gray-200 text-lg">{subtitle}</p>
      </div>

      {/* Decorative Glow */}
      <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-so-primary/20 rounded-full blur-3xl" />
    </div>
  );
}

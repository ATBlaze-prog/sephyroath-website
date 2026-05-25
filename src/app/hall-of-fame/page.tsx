'use client';

import { motion } from 'framer-motion';

export default function HallOfFamePage() {
  return (
    <div className="min-h-screen py-20">
      <motion.div className="container-primary">
        <h1 className="section-title mb-8">
          Hall of <span className="text-gradient">Fame</span>
        </h1>
        <div className="card-glassmorphism text-center py-20">
          <p className="text-xl text-so-gray-300 mb-4">Hall of Fame - Coming Soon</p>
          <p className="text-so-gray-400">
            Celebrate the legends, champions, and heroes of SephyrOath.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

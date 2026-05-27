'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ASSETS } from '@/lib/assets';

interface AnnouncementBanner {
  id: string;
  title: string;
  message: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
}

export default function HomePage() {
  const [activeMembers, setActiveMembers] = useState<number>(0);
  const [announcements] = useState<AnnouncementBanner[]>([]);
  const [discordInvite, setDiscordInvite] = useState<string>(process.env.NEXT_PUBLIC_DISCORD_INVITE || '');

  useEffect(() => {
    async function fetchMemberCount() {
      try {
        const response = await fetch('/api/members/count');
        const data = await response.json();
        setActiveMembers(data.count ?? 0);
      } catch (error) {
        console.error('Failed to load active member count', error);
      }
    }

    async function loadSettings() {
      try {
        const response = await fetch('/api/settings');
        const json = await response.json();
        if (!response.ok) return;
        const settings = json.data.reduce((acc: Record<string, string>, item: any) => {
          if (item.key && item.valueUrl) {
            acc[item.key] = item.valueUrl;
          }
          return acc;
        }, {});
        setDiscordInvite(settings.discord_invite || process.env.NEXT_PUBLIC_DISCORD_INVITE || '');
      } catch (error) {
        console.error('Unable to load settings', error);
      }
    }

    fetchMemberCount();
    loadSettings();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32 min-h-[60vh] flex items-center">
        
        {/* Dynamic SephyrOath Banner Asset Image Wrapper */}
        <div 
          className="absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat transform scale-105 transition-transform duration-1000"
          style={{ backgroundImage: `url('${ASSETS.BANNER}')` }}
        />
        
        {/* Dark Tactical Backdrop Layer */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-950/40 via-slate-950/80 to-slate-950" />

        {/* Background Glow Ambient Lights */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-so-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-so-purple/5 rounded-full blur-3xl" />
        </div>

        <motion.div
          className="container-primary w-full mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Main Headline */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <div className="mb-6 inline-block px-6 py-2 rounded-full border border-so-primary/50 bg-so-primary/10 backdrop-blur-sm">
              <span className="text-so-primary text-sm font-semibold">Welcome to SephyrOath</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-md">
              <span className="text-gradient">Forged Through Loyalty.</span>
              <br />
              <span className="text-so-gold">United Through Victory.</span>
            </h1>
            <p className="text-xl text-so-gray-300 max-w-2xl mx-auto mb-8 drop-shadow">
              A gaming community built on honor, teamwork, and competitive excellence.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/recruitment"
              className="btn-primary inline-block text-center"
            >
              Join SephyrOath
            </Link>
            <Link
              href="/recruitment"
              className="btn-secondary inline-block text-center"
            >
              Apply Now
            </Link>
            <a
              href={discordInvite || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-lg border-2 border-blue-500 text-blue-400 hover:bg-blue-500/10 transition-all duration-300 inline-block text-center backdrop-blur-sm"
            >
              Join Discord
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 border-t border-so-primary/10">
        <motion.div className="container-primary">
          <motion.h2
            className="section-title mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Why Choose <span className="text-gradient">SephyrOath?</span>
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '⚔️',
                title: 'Competitive Excellence',
                description:
                  'Join elite competitive teams in multiple gaming titles and compete for glory.',
              },
              {
                icon: '🏛️',
                title: 'Brotherhood & Loyalty',
                description:
                  'Build lasting bonds with members bound by the Oath and united by honor.',
              },
              {
                icon: '🎯',
                title: 'Growth & Achievement',
                description:
                  'Develop your skills, earn badges, and build your legacy in our community.',
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                className="card-glassmorphism hover:border-so-primary/50 transition-all group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-so-gold mb-2">{feature.title}</h3>
                <p className="text-so-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Stats Section — NOW REAL 2026 LAUNCH METRICS */}
      <section className="py-20 border-t border-so-primary/10">
        <motion.div
          className="container-primary"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: String(activeMembers), label: 'Active Members' },
              { number: '1', label: 'Games Supported' },
              { number: '2', label: 'Tournaments' },
              { number: '2026', label: 'Founded' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <p className="text-4xl md:text-5xl font-bold text-gradient mb-2">
                  {stat.number}
                </p>
                <p className="text-so-gray-300">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Latest Announcements */}
      {announcements.length > 0 && (
        <section className="py-20 border-t border-so-primary/10">
          <motion.div className="container-primary">
            <h2 className="section-title mb-8">Latest News</h2>
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <motion.div
                  key={announcement.id}
                  className={`card-glassmorphism border-l-4 ${
                    announcement.severity === 'CRITICAL'
                      ? 'border-red-500'
                      : announcement.severity === 'WARNING'
                        ? 'border-yellow-500'
                        : 'border-blue-500'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <h3 className="font-bold mb-2">{announcement.title}</h3>
                  <p className="text-so-gray-300">{announcement.message}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 border-t border-so-primary/10">
        <motion.div
          className="container-primary text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Join the <span className="text-gradient">Brotherhood?</span>
          </h2>
          <p className="text-xl text-so-gray-300 max-w-2xl mx-auto mb-8">
            Become part of a community where honor, loyalty, and victory define us.
          </p>
          <Link href="/recruitment" className="btn-primary inline-block">
            Start Your Journey Today
          </Link>
        </motion.div>
      </section>
    </>
  );
}
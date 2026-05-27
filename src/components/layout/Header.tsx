'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { ASSETS } from '@/lib/assets';
import { Mail, ShieldCheck, Menu } from 'lucide-react';

interface NavLink {
  label: string;
  href: string;
  public: boolean;
}

const navLinks: NavLink[] = [
  { label: 'Home', href: '/', public: true },
  { label: 'Games', href: '/games', public: true },
  { label: 'Members', href: '/members', public: true },
  { label: 'Recruitment', href: '/recruitment', public: true },
  { label: 'Tournaments', href: '/tournaments', public: true },
  { label: 'Events', href: '/events', public: true },
  { label: 'Hall of Fame', href: '/hall-of-fame', public: true },
  { label: 'The Creed', href: '/the-creed', public: true },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const [discordInvite, setDiscordInvite] = useState<string>(process.env.NEXT_PUBLIC_DISCORD_INVITE || '');
  const { data: session } = useSession();

  const isAdmin = !!session?.user?.role && ['ADMIN', 'OWNER'].includes(session.user.role);
  const isOwner = session?.user?.role === 'OWNER';

  useEffect(() => {
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
        console.error('Unable to load site settings:', error);
      }
    }

    loadSettings();
  }, []);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-so-dark/80 border-b border-so-primary/20">
      <nav className="container-primary py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="relative w-12 h-12 flex-shrink-0">
            <Image
              src={ASSETS.LOGO}
              alt="SephyrOath Logo"
              width={48}
              height={48}
              className="object-contain rounded-lg"
              priority
            />
          </div>
          <span className="hidden sm:inline font-heading font-bold text-so-gold text-lg">
            SephyrOath
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-so-gray-200 hover:text-so-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Side - Auth & Discord */}
        <div className="relative flex items-center gap-4">
          <a
            href={discordInvite || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-block px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Discord
          </a>

          {session ? (
            <button
              onClick={() => signOut()}
              className="px-4 py-2 rounded-lg border border-so-primary text-so-primary hover:bg-so-primary hover:text-white transition-all text-sm font-medium"
            >
              Sign Out
            </button>
          ) : (
            <Link
              href="/auth/login"
              className="px-4 py-2 rounded-lg bg-gradient-fire text-white text-sm font-medium hover:shadow-glow-red-lg transition-all"
            >
              Login
            </Link>
          )}

          {isAdmin && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsAdminMenuOpen((current) => !current)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-so-primary/40 bg-so-dark/80 text-so-primary hover:bg-so-primary/10 transition"
                aria-expanded={isAdminMenuOpen}
                aria-label="Toggle admin menu"
              >
                <Menu className="h-5 w-5" />
              </button>

              {isAdminMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 top-full mt-3 w-52 rounded-2xl border border-so-primary/20 bg-so-dark/95 p-3 shadow-2xl shadow-black/30 z-50"
                >
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/admin/inbox"
                      className="rounded-2xl px-3 py-2 text-sm text-so-gray-100 hover:bg-so-primary/10 hover:text-so-primary transition"
                      onClick={() => setIsAdminMenuOpen(false)}
                    >
                      <span className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Application Inbox
                      </span>
                    </Link>
                    {isOwner && (
                      <Link
                        href="/owner"
                        className="rounded-2xl px-3 py-2 text-sm text-so-gray-100 hover:bg-so-primary/10 hover:text-so-primary transition"
                        onClick={() => setIsAdminMenuOpen(false)}
                      >
                        <span className="flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4" />
                          Owner Panel
                        </span>
                      </Link>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 text-so-primary"
          >
            <span
              className={`w-6 h-0.5 bg-current transition-transform ${
                isMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            />
            <span
              className={`w-6 h-0.5 bg-current transition-opacity ${isMenuOpen ? 'opacity-0' : ''}`}
            />
            <span
              className={`w-6 h-0.5 bg-current transition-transform ${
                isMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="lg:hidden border-t border-so-primary/20 bg-so-darker/95 backdrop-blur-md"
        >
          <div className="container-primary py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-so-gray-200 hover:text-so-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </header>
  );
}

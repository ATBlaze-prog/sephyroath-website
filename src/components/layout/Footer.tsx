'use client';

import Link from 'next/link';
import { Globe, Mail, Music2 } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-so-darker border-t border-so-primary/20 mt-20">
      <div className="container-primary py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-heading font-bold text-so-gold mb-4">SephyrOath</h3>
            <p className="text-so-gray-300 text-sm">
              Bound by Oath. Guided by Honor. United as One.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-so-gray-100 mb-4">Community</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/members" className="text-so-gray-300 hover:text-so-primary transition-colors">
                  Members
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-so-gray-300 hover:text-so-primary transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/tournaments" className="text-so-gray-300 hover:text-so-primary transition-colors">
                  Tournaments
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-so-gray-100 mb-4">Gameplay</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/games" className="text-so-gray-300 hover:text-so-primary transition-colors">
                  Games
                </Link>
              </li>
              <li>
                <Link href="/hall-of-fame" className="text-so-gray-300 hover:text-so-primary transition-colors">
                  Hall of Fame
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-so-gray-100 mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="mailto:sephyroathgaming@gmail.com"
                  className="text-so-gray-300 hover:text-so-primary transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  General Inquiries
                </a>
              </li>
              <li>
                <a
                  href="https://web.facebook.com/profile.php?id=61570778844927"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-so-gray-300 hover:text-so-primary transition-colors flex items-center gap-2"
                >
                  <Globe className="w-4 h-4" />
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://www.tiktok.com/@sephyroathesports?is_from_webapp=1&sender_device=pc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-so-gray-300 hover:text-so-primary transition-colors flex items-center gap-2"
                >
                  <Music2 className="w-4 h-4" />
                  TikTok
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-so-primary/20 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-so-gray-400 text-sm">
            © {currentYear} SephyrOath Gaming. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

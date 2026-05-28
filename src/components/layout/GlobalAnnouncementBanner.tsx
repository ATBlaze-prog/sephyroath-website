/**
 * Global Announcement Banner Component
 * Displays active global announcements at the top of pages
 */

'use client';

import { useEffect, useState } from 'react';
import { X, AlertCircle, AlertTriangle } from 'lucide-react';

interface GlobalAnnouncement {
  id: string;
  title: string;
  content: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  isActive: boolean;
  expiresAt: string | null;
}

export default function GlobalAnnouncementBanner() {
  const [announcements, setAnnouncements] = useState<GlobalAnnouncement[]>([]);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
    const interval = setInterval(fetchAnnouncements, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('/api/global-announcements');
      const data = await res.json();
      if (data.success) {
        setAnnouncements(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const dismiss = (id: string) => {
    setDismissedIds((prev) => new Set(prev).add(id));
  };

  const visibleAnnouncements = announcements.filter((a) => !dismissedIds.has(a.id));

  if (loading || visibleAnnouncements.length === 0) {
    return null;
  }

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return {
          bg: 'bg-red-600',
          icon: AlertTriangle,
          textColor: 'text-red-600',
        };
      case 'WARNING':
        return {
          bg: 'bg-yellow-600',
          icon: AlertCircle,
          textColor: 'text-yellow-600',
        };
      case 'INFO':
      default:
        return {
          bg: 'bg-blue-600',
          icon: AlertCircle,
          textColor: 'text-blue-600',
        };
    }
  };

  return (
    <>
      {visibleAnnouncements.map((announcement) => {
        const styles = getSeverityStyles(announcement.severity);
        const IconComponent = styles.icon;

        return (
          <div
            key={announcement.id}
            className={`${styles.bg} text-white px-4 py-3 shadow-lg`}
          >
            <div className="container-primary flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <IconComponent size={20} className="mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-bold text-sm mb-1">{announcement.title}</h3>
                  <p className="text-sm opacity-95">{announcement.content}</p>
                </div>
              </div>
              <button
                onClick={() => dismiss(announcement.id)}
                className="flex-shrink-0 hover:opacity-80 transition-opacity mt-1"
                aria-label="Dismiss announcement"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        );
      })}
    </>
  );
}

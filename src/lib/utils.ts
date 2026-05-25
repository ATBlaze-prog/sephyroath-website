/**
 * Common utility functions for the SephyrOath platform
 */

/**
 * Format a date to a readable string
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format a date with time
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get user role display name
 */
export function getRoleDisplayName(role: string): string {
  const roleMap: Record<string, string> = {
    SUPER_ADMIN: 'Super Admin',
    CLAN_LEADER: 'Clan Leader',
    CO_LEADER: 'Co-Leader',
    STAFF_ADMIN: 'Staff Admin',
    MODERATOR: 'Moderator',
    COMPETITIVE_PLAYER: 'Competitive Player',
    CASUAL_PLAYER: 'Casual Player',
    RECRUIT: 'Recruit',
    VISITOR: 'Visitor',
  };
  return roleMap[role] || role;
}

/**
 * Check if user has permission
 */
export function hasPermission(userRole: string, requiredRole: string): boolean {
  const roleHierarchy: Record<string, number> = {
    SUPER_ADMIN: 1,
    CLAN_LEADER: 2,
    CO_LEADER: 3,
    STAFF_ADMIN: 4,
    MODERATOR: 5,
    COMPETITIVE_PLAYER: 6,
    CASUAL_PLAYER: 7,
    RECRUIT: 8,
    VISITOR: 9,
  };

  const userLevel = roleHierarchy[userRole] || 9;
  const requiredLevel = roleHierarchy[requiredRole] || 9;

  return userLevel <= requiredLevel;
}

/**
 * Format file size to human readable
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Generate a unique slug from a string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '...';
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Delay execution (for async operations)
 */
export async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Get time ago from date
 */
export function getTimeAgo(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  const intervals: Record<string, number> = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [key, value] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / value);
    if (interval >= 1) {
      return interval === 1 ? `1 ${key} ago` : `${interval} ${key}s ago`;
    }
  }

  return 'just now';
}

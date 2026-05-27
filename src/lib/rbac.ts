/**
 * Role-Based Access Control (RBAC) utilities for SephyrOath
 */

import { UserRole } from '@prisma/client';

export type Permission = 
  | 'view_admin'
  | 'manage_events'
  | 'manage_tournaments'
  | 'manage_hall_of_fame'
  | 'manage_announcements'
  | 'manage_members'
  | 'manage_social_media'
  | 'manage_users'
  | 'manage_settings'
  | 'manage_owner';

/**
 * Define permissions for each role
 */
const rolePermissions: Record<UserRole, Permission[]> = {
  OWNER: [
    'view_admin',
    'manage_events',
    'manage_tournaments',
    'manage_hall_of_fame',
    'manage_announcements',
    'manage_members',
    'manage_social_media',
    'manage_users',
    'manage_settings',
    'manage_owner',
  ],
  ADMIN: [
    'view_admin',
    'manage_events',
    'manage_tournaments',
    'manage_hall_of_fame',
    'manage_announcements',
    'manage_members',
    'manage_social_media',
  ],
  CLAN_LEADER: [
    'view_admin',
    'manage_members',
  ],
  CO_LEADER: [
    'view_admin',
    'manage_members',
  ],
  STAFF_ADMIN: [
    'view_admin',
    'manage_events',
  ],
  MODERATOR: [
    'view_admin',
  ],
  COMPETITIVE_PLAYER: [],
  CASUAL_PLAYER: [],
  RECRUIT: [],
  VISITOR: [],
  SPECTATOR: [],
};

/**
 * Check if a user has a specific permission
 */
export function hasPermission(role: UserRole | undefined, permission: Permission): boolean {
  if (!role) return false;
  return rolePermissions[role]?.includes(permission) ?? false;
}

/**
 * Check if a user has any of the specified permissions
 */
export function hasAnyPermission(role: UserRole | undefined, permissions: Permission[]): boolean {
  if (!role) return false;
  return permissions.some((permission) => hasPermission(role, permission));
}

/**
 * Check if a user has all of the specified permissions
 */
export function hasAllPermissions(role: UserRole | undefined, permissions: Permission[]): boolean {
  if (!role) return false;
  return permissions.every((permission) => hasPermission(role, permission));
}

/**
 * Require specific role(s)
 */
export function requireRole(role: UserRole | undefined, ...requiredRoles: UserRole[]): boolean {
  if (!role) return false;
  return requiredRoles.includes(role);
}

/**
 * Require at least ADMIN level access
 */
export function requireAdminAccess(role: UserRole | undefined): boolean {
  if (!role) return false;
  return ['OWNER', 'ADMIN', 'STAFF_ADMIN'].includes(role);
}

/**
 * Require OWNER level access
 */
export function requireOwnerAccess(role: UserRole | undefined): boolean {
  return role === 'OWNER';
}

/**
 * Get the permission level of a role (for hierarchy checking)
 * Higher numbers = more permissions
 */
export function getPermissionLevel(role: UserRole | undefined): number {
  switch (role) {
    case 'OWNER':
      return 100;
    case 'ADMIN':
      return 80;
    case 'STAFF_ADMIN':
      return 70;
    case 'CLAN_LEADER':
      return 60;
    case 'CO_LEADER':
      return 55;
    case 'MODERATOR':
      return 50;
    case 'COMPETITIVE_PLAYER':
      return 20;
    case 'CASUAL_PLAYER':
      return 15;
    case 'RECRUIT':
      return 10;
    case 'VISITOR':
      return 5;
    case 'SPECTATOR':
      return 1;
    default:
      return 0;
  }
}

/**
 * Check if a user can manage another user (based on role hierarchy)
 */
export function canManageUser(managerRole: UserRole | undefined, targetRole: UserRole): boolean {
  const managerLevel = getPermissionLevel(managerRole);
  const targetLevel = getPermissionLevel(targetRole);
  return managerLevel > targetLevel;
}

/**
 * Check if a user can delete the Owner account (no one can)
 */
export function canDeleteOwner(role: UserRole | undefined): boolean {
  return false; // Owner cannot be deleted by anyone
}

/**
 * Format role for display
 */
export function formatRole(role: UserRole): string {
  return role
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Admin utilities for permission checking and authorization
 */

import { UserRole } from '@prisma/client';

export function isAdmin(role: UserRole | null | undefined): boolean {
  return role === 'ADMIN' || role === 'OWNER';
}

export function isOwner(role: UserRole | null | undefined): boolean {
  return role === 'OWNER';
}

export function canManageContent(role: UserRole | null | undefined): boolean {
  return isAdmin(role);
}

export function canManageUsers(role: UserRole | null | undefined): boolean {
  return isOwner(role);
}

export function canDeleteOwner(role: UserRole | null | undefined): boolean {
  return role === 'OWNER';
}

export interface AdminResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export function successResponse<T>(data: T): AdminResponse<T> {
  return { success: true, data };
}

export function errorResponse(error: string): AdminResponse<never> {
  return { success: false, error };
}

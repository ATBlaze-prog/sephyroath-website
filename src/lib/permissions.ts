import { NextResponse } from 'next/server';
import type { Session } from 'next-auth';

/**
 * Centralized permission helpers for API routes.
 * Returns a NextResponse when unauthorized, otherwise null.
 */
export function requireAdminOrOwner(session: Session | null) {
  const role = (session?.user as any)?.role as string | undefined;
  if (!session || !role || !['OWNER', 'ADMIN', 'STAFF_ADMIN'].includes(role)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

export function requireOwner(session: Session | null) {
  const role = (session?.user as any)?.role as string | undefined;
  if (!session || role !== 'OWNER') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

export function debugLog(...items: any[]) {
  try {
    console.debug('[DEBUG]', ...items);
  } catch {}
}

/**
 * Asset Configuration for SephyrOath
 * Maps local and remote assets for use throughout the app
 */

export const ASSETS = {
  // Local assets (in public/assets/) with safe URL space encoding
  LOGO: '/assets/Logo%20Only.jpg',
  BANNER: '/assets/SephyrOath%20Cover.jpg',

  // Database keys (for dynamic injection from backend)
  GLOBAL_LOGO_URL: 'global_logo_url',
  GLOBAL_BANNER_URL: 'global_banner_url',

  // Default fallback URLs
  FALLBACK_LOGO: '/assets/Logo%20Only.jpg',
  FALLBACK_BANNER: '/assets/SephyrOath%20Cover.jpg',
};

/**
 * Get asset URL with fallback to local files
 */
export async function getAssetUrl(
  assetKey: string,
  fallbackUrl: string
): Promise<string> {
  try {
    const res = await fetch(`/api/assets/${assetKey}`);
    if (!res.ok) {
      return fallbackUrl;
    }

    const data = await res.json();
    return data.valueUrl || fallbackUrl;
  } catch (error) {
    console.error(`Failed to fetch asset ${assetKey}:`, error);
    return fallbackUrl;
  }
}
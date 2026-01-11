/**
 * Extract Facebook ID from various URL formats
 * Reference: https://id.traodoisub.com/
 */
export function extractFacebookId(url: string): string {
  if (!url) return '';

  try {
    // Remove whitespace and trailing slash
    url = url.trim().replace(/\/+$/, '');

    // If it's already just a number, return it
    if (/^\d+$/.test(url)) {
      return url;
    }

    // Pattern 0: pfbid (Private Facebook ID - new format)
    // pfbid can be very long (100+ characters)
    // Extract from path, not query params
    const pathOnly = url.split('?')[0].split('#')[0];
    const pfbidMatch = pathOnly.match(/pfbid[a-zA-Z0-9]{10,}/);
    if (pfbidMatch) return pfbidMatch[0];

    // Pattern 1: /posts/{id} or /photos/{id}
    const postsMatch = url.match(/\/(?:posts|photos)\/([a-zA-Z0-9]+)/);
    if (postsMatch) return postsMatch[1];

    // Pattern 2: /permalink/{id}
    const permalinkMatch = url.match(/\/permalink\/([a-zA-Z0-9]+)/);
    if (permalinkMatch) return permalinkMatch[1];

    // Pattern 3: /reel/{id}
    const reelMatch = url.match(/\/reel\/([a-zA-Z0-9_-]+)/);
    if (reelMatch) return reelMatch[1];

    // Pattern 4: /videos/{id}
    const videoMatch = url.match(/\/videos\/([a-zA-Z0-9]+)/);
    if (videoMatch) return videoMatch[1];

    // Pattern 5: fbid={id} or ?id={id}
    const fbidMatch = url.match(/[?&](?:fbid|id)=([a-zA-Z0-9]+)/);
    if (fbidMatch) return fbidMatch[1];

    // Pattern 6: story_fbid={id}
    const storyMatch = url.match(/story_fbid=([a-zA-Z0-9]+)/);
    if (storyMatch) return storyMatch[1];

    // Pattern 7: /photo.php?fbid={id}
    const photoMatch = url.match(/\/photo\.php\?[^&]*fbid=([a-zA-Z0-9]+)/);
    if (photoMatch) return photoMatch[1];

    // Pattern 8: gfid={id} (for groups)
    const gfidMatch = url.match(/gfid=([a-zA-Z0-9]+)/);
    if (gfidMatch) return gfidMatch[1];

    // Pattern 9: /groups/{id}
    const groupMatch = url.match(/\/groups\/([a-zA-Z0-9]+)/);
    if (groupMatch) return groupMatch[1];

    // Pattern 10: profile.php?id={id}
    const profileMatch = url.match(/profile\.php\?id=([a-zA-Z0-9]+)/);
    if (profileMatch) return profileMatch[1];

    // Pattern 11: /story.php?story_fbid={id}
    const storyPhpMatch = url.match(/\/story\.php\?story_fbid=([a-zA-Z0-9]+)/);
    if (storyPhpMatch) return storyPhpMatch[1];

    // Pattern 12: Extract any long number (15+ digits) from URL
    const longNumberMatch = url.match(/(\d{15,})/);
    if (longNumberMatch) return longNumberMatch[1];

    // If no pattern matches, return original URL
    return url;
  } catch (error) {
    console.error('Error extracting Facebook ID:', error);
    return url;
  }
}

/**
 * Extract TikTok username or video ID
 */
export function extractTikTokId(url: string): string {
  if (!url) return '';

  try {
    url = url.trim();

    // Pattern 1: /@username
    const usernameMatch = url.match(/\/@([a-zA-Z0-9._]+)/);
    if (usernameMatch) return '@' + usernameMatch[1];

    // Pattern 2: /video/{id}
    const videoMatch = url.match(/\/video\/(\d+)/);
    if (videoMatch) return videoMatch[1];

    // Pattern 3: vm.tiktok.com/{shortcode}
    const shortMatch = url.match(/vm\.tiktok\.com\/([a-zA-Z0-9]+)/);
    if (shortMatch) return url; // Return full short URL

    return url;
  } catch (error) {
    console.error('Error extracting TikTok ID:', error);
    return url;
  }
}

/**
 * Extract Instagram username or post code
 */
export function extractInstagramId(url: string): string {
  if (!url) return '';

  try {
    url = url.trim();

    // Pattern 1: /p/{shortcode}
    const postMatch = url.match(/\/p\/([a-zA-Z0-9_-]+)/);
    if (postMatch) return postMatch[1];

    // Pattern 2: /reel/{shortcode}
    const reelMatch = url.match(/\/reel\/([a-zA-Z0-9_-]+)/);
    if (reelMatch) return reelMatch[1];

    // Pattern 3: /{username}
    const usernameMatch = url.match(/instagram\.com\/([a-zA-Z0-9._]+)/);
    if (usernameMatch && !usernameMatch[1].includes('/')) {
      return '@' + usernameMatch[1];
    }

    return url;
  } catch (error) {
    console.error('Error extracting Instagram ID:', error);
    return url;
  }
}

/**
 * Extract Telegram username or group ID
 */
export function extractTelegramId(url: string): string {
  if (!url) return '';

  try {
    url = url.trim();

    // Pattern 1: t.me/{username}
    const usernameMatch = url.match(/t\.me\/([a-zA-Z0-9_]+)/);
    if (usernameMatch) return '@' + usernameMatch[1];

    // Pattern 2: @username
    const atMatch = url.match(/@([a-zA-Z0-9_]+)/);
    if (atMatch) return '@' + atMatch[1];

    return url;
  } catch (error) {
    console.error('Error extracting Telegram ID:', error);
    return url;
  }
}
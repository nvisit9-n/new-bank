/**
 * YouTube Service strictly locked to official channel @bankingtayarinepal
 * Channel URL: https://www.youtube.com/@bankingtayarinepal
 * Channel ID: UC94GEqSO8INuQYH1xM10DxQ
 */

export interface YouTubeVideoItem {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  author: string;
  thumbnail: string;
  description: string;
  isNew: boolean;
  timeAgoNepali: string;
}

export const OFFICIAL_CHANNEL = {
  handle: '@bankingtayarinepal',
  name: 'Banking Tayari Nepal',
  channelUrl: 'https://www.youtube.com/@bankingtayarinepal',
  subscribeUrl: 'https://www.youtube.com/@bankingtayarinepal?sub_confirmation=1',
  channelId: 'UC94GEqSO8INuQYH1xM10DxQ',
  primaryRssFeed: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.youtube.com/feeds/videos.xml?user=bankingtayarinepal',
  channelIdRssFeed: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.youtube.com/feeds/videos.xml?channel_id=UC94GEqSO8INuQYH1xM10DxQ'
};

const STORAGE_CACHE_KEY = 'btn_official_youtube_feed_v1';
const STORAGE_CACHE_TIME_KEY = 'btn_official_youtube_feed_time_v1';

// Pre-verified official videos from @bankingtayarinepal to guarantee immediate display without delay
export const OFFICIAL_SEED_VIDEOS: YouTubeVideoItem[] = [
  {
    id: 'ufBabjoCA8k',
    title: 'FIFA World Cup PRE TEST SPECIAL 🏆 | सम्पूर्ण इतिहास, महत्वपूर्ण रेकर्ड र 2026 अपडेट | Loksewa GK',
    link: 'https://www.youtube.com/watch?v=ufBabjoCA8k',
    pubDate: '2026-08-11 06:51:37',
    author: 'Banking Tayari Nepal',
    thumbnail: 'https://i2.ytimg.com/vi/ufBabjoCA8k/hqdefault.jpg',
    description: 'लोकसेवा तथा बैंकिङ परीक्षाको लागि फिफा विश्वकप विशेष सामान्य ज्ञान।',
    isNew: true,
    timeAgoNepali: 'भर्खरै अपलोड भएको'
  },
  {
    id: 'nB-4B11dJHU',
    title: 'समसामहिक घटनाक्रम Topic Wise २०८२ देखि २०८३ जेठ सम्म | Current Affair 2082 to 2083 Jestha | Pretest',
    link: 'https://www.youtube.com/watch?v=nB-4B11dJHU',
    pubDate: '2026-06-16 10:21:51',
    author: 'Banking Tayari Nepal',
    thumbnail: 'https://i3.ytimg.com/vi/nB-4B11dJHU/hqdefault.jpg',
    description: 'समसामयिक घटनाक्रम Topic Wise महत्वपूर्ण संग्रह।',
    isNew: false,
    timeAgoNepali: 'केही समय अघि'
  },
  {
    id: 'ViCoKf3tTfA',
    title: 'संगठित संस्था MCQ | ३० महत्वपूर्ण प्रश्नहरू | लोकसेवा आयोग Pre-Test Preparation',
    link: 'https://www.youtube.com/watch?v=ViCoKf3tTfA',
    pubDate: '2025-08-11 10:07:08',
    author: 'Banking Tayari Nepal',
    thumbnail: 'https://i3.ytimg.com/vi/ViCoKf3tTfA/hqdefault.jpg',
    description: 'कर्मचारी सञ्चय कोष, नागरिक लगानी कोष तथा टेलिकम विशेष MCQ।',
    isNew: false,
    timeAgoNepali: 'लोकसेवा विशेष'
  },
  {
    id: '97HICeVfZUY',
    title: 'Current Affairs | National Film Award 2082 | Must Watch for Lok Sewa & Banking Aspirants',
    link: 'https://www.youtube.com/watch?v=97HICeVfZUY',
    pubDate: '2025-07-17 11:53:54',
    author: 'Banking Tayari Nepal',
    thumbnail: 'https://i2.ytimg.com/vi/97HICeVfZUY/hqdefault.jpg',
    description: 'राष्ट्रिय चलचित्र पुरस्कार तथा समसामयिक सामान्य ज्ञान।',
    isNew: false,
    timeAgoNepali: 'समसामयिक'
  },
  {
    id: 'bE-3uQ5qgpk',
    title: 'Banking Quiz | Banking Tayari Nepal | नेपाल राष्ट्र बैंक परीक्षा 2082 | Banking Vacancy 2082',
    link: 'https://www.youtube.com/watch?v=bE-3uQ5qgpk',
    pubDate: '2024-11-15 10:59:39',
    author: 'Banking Tayari Nepal',
    thumbnail: 'https://i3.ytimg.com/vi/bE-3uQ5qgpk/hqdefault.jpg',
    description: 'नेपाल राष्ट्र बैंक र वाणिज्य बैंकहरूको लागि महत्वपूर्ण बैंकिङ क्विज।',
    isNew: false,
    timeAgoNepali: 'बैंकिङ क्विज'
  },
  {
    id: '-sIvbHsvk6g',
    title: 'Nepal Rastra Bank Mero Sapana Song | NRB Song',
    link: 'https://www.youtube.com/watch?v=-sIvbHsvk6g',
    pubDate: '2025-01-12 10:25:33',
    author: 'Banking Tayari Nepal',
    thumbnail: 'https://i2.ytimg.com/vi/-sIvbHsvk6g/hqdefault.jpg',
    description: 'नेपाल राष्ट्र बैंक मेरो सपना - Motivational Song for Banking Aspirants',
    isNew: false,
    timeAgoNepali: 'प्रेरणादायी'
  }
];

/**
 * Checks if a video was published within the last 7 days.
 */
export const isVideoNew = (pubDateStr: string): boolean => {
  if (!pubDateStr) return false;
  try {
    const pubTime = new Date(pubDateStr.replace(' ', 'T')).getTime();
    if (isNaN(pubTime)) return false;
    const now = Date.now();
    const diffMs = now - pubTime;
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 7;
  } catch {
    return false;
  }
};

/**
 * Formats date into readable Nepali relative or absolute string.
 */
export const formatVideoDateNepali = (pubDateStr: string): string => {
  if (!pubDateStr) return '';
  try {
    const pubTime = new Date(pubDateStr.replace(' ', 'T')).getTime();
    if (isNaN(pubTime)) return pubDateStr.split(' ')[0] || pubDateStr;
    const now = Date.now();
    const diffDays = Math.floor((now - pubTime) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'आज प्रकाशित';
    if (diffDays === 1) return 'हिजो प्रकाशित';
    if (diffDays <= 7) return `${diffDays} दिन अघि`;
    if (diffDays <= 30) return `${Math.floor(diffDays / 7)} हप्ता अघि`;
    if (diffDays <= 365) return `${Math.floor(diffDays / 30)} महिना अघि`;
    return `${Math.floor(diffDays / 365)} वर्ष अघि`;
  } catch {
    return pubDateStr.split(' ')[0] || pubDateStr;
  }
};

/**
 * Extracts YouTube 11-char Video ID
 */
export const extractVideoId = (link: string, guid?: string): string => {
  if (guid && guid.includes('yt:video:')) {
    return guid.replace('yt:video:', '');
  }
  const match = link.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/);
  if (match && match[1]) {
    return match[1];
  }
  return '';
};

/**
 * Fetches and strictly filters YouTube videos from official channel @bankingtayarinepal
 */
export const fetchOfficialChannelVideos = async (forceRefresh = false): Promise<{
  videos: YouTubeVideoItem[];
  fromCache: boolean;
  channelTitle: string;
}> => {
  // Check local cache if not forced
  if (!forceRefresh) {
    try {
      const cached = localStorage.getItem(STORAGE_CACHE_KEY);
      const cachedTime = localStorage.getItem(STORAGE_CACHE_TIME_KEY);
      if (cached && cachedTime) {
        const age = Date.now() - parseInt(cachedTime, 10);
        // Cache valid for 30 minutes
        if (age < 30 * 60 * 1000) {
          const parsed = JSON.parse(cached) as YouTubeVideoItem[];
          if (parsed && parsed.length > 0) {
            // Re-evaluate isNew with current time
            const refreshed = parsed.map(v => ({
              ...v,
              isNew: isVideoNew(v.pubDate)
            }));
            return { videos: refreshed, fromCache: true, channelTitle: OFFICIAL_CHANNEL.name };
          }
        }
      }
    } catch (e) {
      console.warn('Could not read cached YouTube videos:', e);
    }
  }

  // Attempt 1: Fetch primary RSS feed as specified by the user
  let rawData: any = null;
  try {
    const res = await fetch(OFFICIAL_CHANNEL.primaryRssFeed, { cache: 'no-cache' });
    if (res.ok) {
      const json = await res.json();
      if (json && json.status === 'ok' && Array.isArray(json.items) && json.items.length > 0) {
        rawData = json;
      }
    }
  } catch (err) {
    console.warn('Primary RSS feed fetch failed, attempting fallback to channel ID feed:', err);
  }

  // Attempt 2: If primary endpoint returned non-ok or empty, fetch via exact channel ID
  if (!rawData) {
    try {
      const res = await fetch(OFFICIAL_CHANNEL.channelIdRssFeed, { cache: 'no-cache' });
      if (res.ok) {
        const json = await res.json();
        if (json && json.status === 'ok' && Array.isArray(json.items) && json.items.length > 0) {
          rawData = json;
        }
      }
    } catch (err) {
      console.error('Channel ID RSS feed fetch error:', err);
    }
  }

  // Process and strictly filter items
  if (rawData && rawData.items && Array.isArray(rawData.items)) {
    const channelTitle = rawData.feed?.title || OFFICIAL_CHANNEL.name;
    const items = rawData.items;

    // STRICT FILTER: Only allow videos from @bankingtayarinepal
    const officialVideos: YouTubeVideoItem[] = items
      .filter((item: any) => {
        const author = (item.author || '').toLowerCase();
        const link = (item.link || '').toLowerCase();
        // Strict channel check: Must match Banking Tayari Nepal
        const isOfficialAuthor = author.includes('banking tayari nepal') || 
                                 author.includes('bankingtayarinepal') ||
                                 author === ''; // RSS feeds sometimes omit author on items if in feed header
        const isYouTubeLink = link.includes('youtube.com') || link.includes('youtu.be');
        return isYouTubeLink && isOfficialAuthor;
      })
      .map((item: any) => {
        const vidId = extractVideoId(item.link, item.guid);
        const pubDate = item.pubDate || '';
        const isNew = isVideoNew(pubDate);
        const timeAgoNepali = formatVideoDateNepali(pubDate);
        
        // High quality thumbnail fallback
        const thumbnail = item.thumbnail || 
          (vidId ? `https://i.ytimg.com/vi/${vidId}/hqdefault.jpg` : '');

        return {
          id: vidId,
          title: item.title?.replace(/&amp;/g, '&')?.replace(/&#39;/g, "'") || '',
          link: item.link || `https://www.youtube.com/watch?v=${vidId}`,
          pubDate,
          author: OFFICIAL_CHANNEL.name,
          thumbnail,
          description: item.description || '',
          isNew,
          timeAgoNepali
        };
      })
      .filter((v: YouTubeVideoItem) => v.id && v.id.length >= 8);

    if (officialVideos.length > 0) {
      try {
        localStorage.setItem(STORAGE_CACHE_KEY, JSON.stringify(officialVideos));
        localStorage.setItem(STORAGE_CACHE_TIME_KEY, Date.now().toString());
      } catch (e) {
        console.warn('Failed to save YouTube videos to localStorage:', e);
      }
      return { videos: officialVideos, fromCache: false, channelTitle };
    }
  }

  // Fallback to verified official seed videos
  const fallback = OFFICIAL_SEED_VIDEOS.map(v => ({
    ...v,
    isNew: isVideoNew(v.pubDate)
  }));

  return { videos: fallback, fromCache: true, channelTitle: OFFICIAL_CHANNEL.name };
};

// ==========================================
// YOUTUBE SUBSCRIPTION GATE & TIMED POPUP GATEWAY
// ==========================================
export const YOUTUBE_UNLOCK_STORAGE_KEY = 'btn_youtube_unlocked_status_v1';
export const YOUTUBE_POPUP_FIRST_SEEN_KEY = 'btn_yt_popup_first_seen_v1';
export const YOUTUBE_POPUP_COMPLETED_KEY = 'btn_yt_popup_completed_v1';
export const YOUTUBE_POPUP_DISMISSED_SESSION_KEY = 'btn_yt_popup_dismissed_session_v1';
export const POPUP_ACTIVE_WINDOW_MS = 2 * 24 * 60 * 60 * 1000; // 48 hours (2 days)

export class YouTubeSubscriptionGate {
  /**
   * Check whether PDF downloads are currently unlocked via YouTube subscription
   */
  static isUnlocked(): boolean {
    try {
      if (typeof window === 'undefined') return false;
      const stored = localStorage.getItem(YOUTUBE_UNLOCK_STORAGE_KEY);
      if (stored === 'true' || stored === 'unlocked') return true;

      // Check completion token
      const completedToken = localStorage.getItem(YOUTUBE_POPUP_COMPLETED_KEY);
      if (completedToken === 'true') return true;

      // Check current user profile cache if available
      const cachedUser = localStorage.getItem('loksewa_user_profile');
      if (cachedUser) {
        const parsed = JSON.parse(cachedUser);
        if (parsed?.isYouTubeSubscribed) return true;
      }
    } catch {
      // ignore
    }
    return false;
  }

  /**
   * Check whether the 2-day timed popup should auto-appear when user visits
   */
  static isTimedPopupEligible(): boolean {
    try {
      if (typeof window === 'undefined') return false;

      // If user already subscribed/unlocked or completed action, do not show
      if (this.isUnlocked()) return false;

      const completed = localStorage.getItem(YOUTUBE_POPUP_COMPLETED_KEY);
      if (completed === 'true') return false;

      // Check session dismissal (do not pop up repeatedly in the exact same browsing session)
      const sessionDismissed = sessionStorage.getItem(YOUTUBE_POPUP_DISMISSED_SESSION_KEY);
      if (sessionDismissed === 'true') return false;

      // Check the 2-day time window
      let firstSeen = localStorage.getItem(YOUTUBE_POPUP_FIRST_SEEN_KEY);
      const now = Date.now();

      if (!firstSeen) {
        // First time seeing the prompt, record timestamp
        localStorage.setItem(YOUTUBE_POPUP_FIRST_SEEN_KEY, now.toString());
        return true;
      }

      const firstSeenTime = parseInt(firstSeen, 10);
      if (isNaN(firstSeenTime)) {
        localStorage.setItem(YOUTUBE_POPUP_FIRST_SEEN_KEY, now.toString());
        return true;
      }

      const elapsed = now - firstSeenTime;
      if (elapsed > POPUP_ACTIVE_WINDOW_MS) {
        // 2 days have elapsed - automatically deactivates and hides permanently
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get remaining time in the 2-day active window
   */
  static getTimeRemaining(): { hours: number; minutes: number; expired: boolean } {
    try {
      const firstSeen = localStorage.getItem(YOUTUBE_POPUP_FIRST_SEEN_KEY);
      if (!firstSeen) {
        return { hours: 48, minutes: 0, expired: false };
      }
      const firstSeenTime = parseInt(firstSeen, 10);
      const now = Date.now();
      const elapsed = now - firstSeenTime;
      const remainingMs = POPUP_ACTIVE_WINDOW_MS - elapsed;

      if (remainingMs <= 0) {
        return { hours: 0, minutes: 0, expired: true };
      }

      const totalMinutes = Math.floor(remainingMs / (1000 * 60));
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return { hours, minutes, expired: false };
    } catch {
      return { hours: 48, minutes: 0, expired: false };
    }
  }

  /**
   * Dismiss the timed popup for the current session
   */
  static dismissForSession(): void {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(YOUTUBE_POPUP_DISMISSED_SESSION_KEY, 'true');
      }
    } catch {}
  }

  /**
   * Complete the subscription & unlock action via popup
   */
  static completeAndUnlock(userEmailOrUid?: string): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(YOUTUBE_POPUP_COMPLETED_KEY, 'true');
      }
      this.unlock(userEmailOrUid);
    } catch {}
  }

  /**
   * Unlock PDF downloads once YouTube subscription link is visited
   */
  static unlock(userEmailOrUid?: string): void {
    try {
      localStorage.setItem(YOUTUBE_UNLOCK_STORAGE_KEY, 'true');
      localStorage.setItem('btn_youtube_unlocked_timestamp', new Date().toISOString());
      localStorage.setItem(YOUTUBE_POPUP_COMPLETED_KEY, 'true');

      // Update local user profile if present
      const cachedUser = localStorage.getItem('loksewa_user_profile');
      if (cachedUser) {
        try {
          const parsed = JSON.parse(cachedUser);
          parsed.isYouTubeSubscribed = true;
          localStorage.setItem('loksewa_user_profile', JSON.stringify(parsed));
        } catch {}
      }

      // Dispatch global window event so all locked buttons instantly update
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('btn-youtube-unlocked', { detail: { unlocked: true } }));
      }
    } catch (e) {
      console.warn('Could not persist YouTube unlock state:', e);
    }
  }

  /**
   * Official channel subscription link
   */
  static getSubscribeUrl(): string {
    return OFFICIAL_CHANNEL.subscribeUrl;
  }
}


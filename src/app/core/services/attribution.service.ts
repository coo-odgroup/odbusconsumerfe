
import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

type Touch = {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  captured_at: string;
};

type OdbusAttribution = {
  first_touch: Touch | null;
  last_touch: Touch | null;
  click_ids: {
    fbclid: string | null;
    gclid: string | null;
    gbraid: string | null;
    wbraid: string | null;
    gad_source: string | null;
    gad_campaignid: string | null;
  };
  fbc: string | null;
  fbp: string | null;
  landing_url: string | null;
  referrer: string | null;
  captured_at: string | null;
};

@Injectable({ providedIn: 'root' })
export class AttributionService {
  private readonly cookieName = 'od_attr';
  private readonly maxAge = 90 * 24 * 60 * 60;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private emptyData(): OdbusAttribution {
    return {
      first_touch: null,
      last_touch: null,
      click_ids: {
        fbclid: null,
        gclid: null,
        gbraid: null,
        wbraid: null,
        gad_source: null,
        gad_campaignid: null
      },
      fbc: null,
      fbp: null,
      landing_url: null,
      referrer: null,
      captured_at: null
    };
  }

  private readCookie(name: string): string | null {
    const prefix = name + '=';

    const item = document.cookie
      .split('; ')
      .find(c => c.startsWith(prefix));

    if (!item) return null;

    try {
      return decodeURIComponent(item.substring(prefix.length));
    } catch {
      return null;
    }
  }

  private readData(): OdbusAttribution {
    const raw = this.readCookie(this.cookieName);
    const empty = this.emptyData();

    if (!raw) return empty;

    try {
      const parsed = JSON.parse(raw);

      return {
        ...empty,
        ...parsed,
        click_ids: {
          ...empty.click_ids,
          ...(parsed.click_ids || {})
        }
      };
    } catch {
      return empty;
    }
  }

  private safeUrl(value: string, includeAllowedParams = false): string | null {
    try {
      const url = new URL(value);

      if (!['https:', 'http:'].includes(url.protocol)) {
        return null;
      }

      // Do not retain arbitrary query parameters or URL fragments.
      const result = new URL(url.origin + url.pathname);

      if (includeAllowedParams) {
        [
          'utm_source', 'utm_medium', 'utm_campaign',
          'utm_content', 'utm_term', 'fbclid',
          'gclid', 'gbraid', 'wbraid',
          'gad_source', 'gad_campaignid'
        ].forEach(key => {
          const val = url.searchParams.get(key);
          if (val) result.searchParams.set(key, val);
        });
      }

      return result.toString();
    } catch {
      return null;
    }
  }

  private save(data: OdbusAttribution): void {
    const secure = location.protocol === 'https:' ? '; Secure' : '';

    // Share the cookie between odbus.in and www.odbus.in.
    document.cookie =
      `${this.cookieName}=${encodeURIComponent(JSON.stringify(data))}` +
      `; Max-Age=${this.maxAge}; Path=/; Domain=.odbus.in` +
      `; SameSite=Lax${secure}`;
  }

  capture(): void {
    if (!this.isBrowser) return;

    // Call this method only when permitted by your cookie-consent rules.
    const params = new URLSearchParams(location.search);
    const data = this.readData();
    const now = new Date().toISOString();

    // Save the original landing page, even for an untagged visit.
    if (!data.landing_url) {
      data.landing_url = this.safeUrl(location.href, true);
      data.referrer = document.referrer
        ? this.safeUrl(document.referrer)
        : null;
    }

    const readParam = (key: string): string | null => {
      const value = params.get(key)?.trim();
      return value || null;
    };

    const incoming: Touch = {
      utm_source: readParam('utm_source'),
      utm_medium: readParam('utm_medium'),
      utm_campaign: readParam('utm_campaign'),
      utm_content: readParam('utm_content'),
      utm_term: readParam('utm_term'),
      captured_at: now
    };

    const clickKeys = [
      'fbclid', 'gclid', 'gbraid', 'wbraid',
      'gad_source', 'gad_campaignid'
    ] as const;

    let newClickId = false;

    clickKeys.forEach(key => {
      const value = readParam(key);

      if (value) {
        data.click_ids[key] = value;
        newClickId = true;
      }
    });

    // Google auto-tagging may provide click IDs without UTM tags.
    // Record inferred channel, but do not invent a campaign name.
    if (!incoming.utm_source &&
        (incoming.utm_medium || incoming.utm_campaign ||
         incoming.utm_content || incoming.utm_term ||
         data.click_ids.gclid || data.click_ids.gbraid ||
         data.click_ids.wbraid || data.click_ids.gad_source ||
         data.click_ids.gad_campaignid) && newClickId) {
      incoming.utm_source = 'google';
      incoming.utm_medium = incoming.utm_medium || 'cpc';
    }

    const hasUtm = [
      incoming.utm_source,
      incoming.utm_medium,
      incoming.utm_campaign,
      incoming.utm_content,
      incoming.utm_term
    ].some(Boolean);

    const hasNewTaggedVisit = hasUtm || newClickId;

    if (hasNewTaggedVisit) {
      // First-touch must never be overwritten.
      if (!data.first_touch) {
        data.first_touch = { ...incoming };
        data.captured_at = now;
      }

      // Only a new tagged visit updates last-touch.
      data.last_touch = { ...incoming };
    }

    data.fbc = this.readCookie('_fbc') || data.fbc;
    data.fbp = this.readCookie('_fbp') || data.fbp;

    this.save(data);
  }

  getAttribution(): OdbusAttribution | null {
    if (!this.isBrowser) return null;
    return this.readData();
  }
}

import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { AuthService } from './auth.service';
import { CommonService } from './common.service';
import { GlobalConstants } from '../constants/global-constants';

/**
 * SPEED FIX (TTFB + first load for new visitors)
 *
 * BEFORE: every single SSR request made 2 API calls in a row (/Auth, then /PopularInfo)
 *         before Angular even started rendering. New browser visitors then made the SAME
 *         2 calls again before the app could boot.
 *
 * AFTER:
 *  - Server: the anonymous token and PopularInfo are kept in Node memory for a few minutes
 *    and shared by all requests (they are not user-specific).
 *  - Browser: PopularInfo is loaded from local storage when available, otherwise fetched.
 */

// Module-level cache: lives for the whole Node process (server only).
const SERVER_TOKEN_TTL_MS = 20 * 60 * 1000;   // set BELOW your real token expiry
const SERVER_POPULAR_TTL_MS = 10 * 60 * 1000;
let serverToken: { value: string; at: number } | null = null;
let serverPopular: { value: any; at: number } | null = null;
let tokenInFlight: Promise<string | null> | null = null;
let popularInFlight: Promise<any> | null = null;

@Injectable()
export class AppInitializerService {
  constructor(
    private auth: AuthService,
    private commonService: CommonService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  load(): Promise<boolean> {
    return this.getAuthToken()
      .then(() => this.fetchPopularInfo())
      .then(() => true)
      .catch((err) => {
        console.error('AppInitializer: error during initialization', err);
        return true; // never block bootstrap
      });
  }

  // ---------------- TOKEN ----------------
  private getAuthToken(): Promise<any> {
    if (isPlatformBrowser(this.platformId)) {
      const existing = localStorage.getItem('AuthAccessToken');
      if (existing) {
        this.auth.setCurrentToken(existing);
        return Promise.resolve(true);
      }
      return this.requestToken().then((t) => {
        if (t) { localStorage.setItem('AuthAccessToken', t); }
        this.auth.setCurrentToken(t);
      });
    }

    // Server: reuse a cached token
    if (serverToken && Date.now() - serverToken.at < SERVER_TOKEN_TTL_MS) {
      this.auth.setCurrentToken(serverToken.value);
      return Promise.resolve(true);
    }
    if (!tokenInFlight) {
      tokenInFlight = this.requestToken().then((t) => {
        if (t) { serverToken = { value: t, at: Date.now() }; }
        tokenInFlight = null;
        return t;
      });
    }
    return tokenInFlight.then((t) => this.auth.setCurrentToken(t));
  }

  private requestToken(): Promise<string | null> {
    return new Promise((resolve) => {
      this.auth.getToken().subscribe(
        (res: any) => resolve(res && res.data ? res.data : null),
        (err) => {
          console.error('AppInitializer: failed to fetch auth token', err);
          resolve(null);
        },
      );
    });
  }

  // ---------------- POPULAR INFO ----------------
  private fetchPopularInfo(): Promise<any> {
    // Browser: returning visitor cache
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem('PopularInfo');
      if (stored) {
        try {
          this.commonService.setPopularInfo(JSON.parse(stored));
          return Promise.resolve(true);
        } catch (e) {}
      }
      return this.requestPopularInfo().then((data) => {
        if (data) {
          this.commonService.setPopularInfo(data);
          localStorage.setItem('PopularInfo', JSON.stringify(data));
        }
      });
    }

    // Server: shared in-memory cache
    const putOnPage = (data: any) => {
      if (data) {
        this.commonService.setPopularInfo(data);
      }
    };
    if (serverPopular && Date.now() - serverPopular.at < SERVER_POPULAR_TTL_MS) {
      putOnPage(serverPopular.value);
      return Promise.resolve(true);
    }
    if (!popularInFlight) {
      popularInFlight = this.requestPopularInfo().then((data) => {
        if (data) { serverPopular = { value: data, at: Date.now() }; }
        popularInFlight = null;
        return data;
      });
    }
    return popularInFlight.then(putOnPage);
  }

  private requestPopularInfo(): Promise<any> {
    const param = { user_id: GlobalConstants.MASTER_SETTING_USER_ID, locationName: '' };
    return new Promise((resolve) => {
      this.commonService.PopularInfo(param).subscribe(
        (resp: any) => resolve(resp && resp.data ? resp.data : resp),
        () => resolve(null),
      );
    });
  }
}

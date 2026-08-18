import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ExternalScriptService {

  private loadedScripts = new Map<string, Promise<void>>();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  loadScript(
    src: string,
    id: string
  ): Promise<void> {

    if (!isPlatformBrowser(this.platformId)) {
      return Promise.resolve();
    }

    if (this.loadedScripts.has(id)) {
      return this.loadedScripts.get(id)!;
    }

    const existingScript = document.getElementById(id);

    if (existingScript) {
      return Promise.resolve();
    }

    const promise = new Promise<void>((resolve, reject) => {

      const script = document.createElement('script');

      script.id = id;
      script.src = src;
      script.async = true;
      script.defer = true;

      script.onload = () => resolve();

      script.onerror = () => {
        reject(new Error(`Failed to load script: ${src}`));
      };

      document.head.appendChild(script);
    });

    this.loadedScripts.set(id, promise);

    return promise;
  }
}
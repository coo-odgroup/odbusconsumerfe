import {
  Component,
  OnInit,
  HostListener,
  ElementRef,
  Inject,
  PLATFORM_ID,
  AfterViewInit
} from '@angular/core';

import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-growing',
  templateUrl: './growing.component.html',
  styleUrls: ['./growing.component.css', '../home.component.css']
})
export class GrowingComponent implements OnInit, AfterViewInit {

  started = false;

  isBrowser = false;

  counters = [
    { value: 0, target: 2500, suffix: '+', label: 'Routes' },
    { value: 0, target: 2200, suffix: '+', label: 'Buses' },
    { value: 0, target: 1000000, suffix: '+', label: 'Satisfied Customers' },
    {
      value: 24,
      target: 24,
      suffix: '/7',
      label: 'Customer Service',
      static: true
    }
  ];

  constructor(
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {

    // Auto trigger if section already visible
    if (this.isBrowser) {
      setTimeout(() => {
        this.checkAndStartCounter();
      }, 300);
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {

    if (!this.isBrowser) {
      return;
    }

    this.checkAndStartCounter();
  }

  checkAndStartCounter(): void {

    if (this.started) {
      return;
    }

    const section =
      this.el.nativeElement.querySelector('.stats-section');

    if (!section) {
      return;
    }

    // SSR Safe

    if ( !isPlatformBrowser(this.platformId) || !section || typeof section.getBoundingClientRect !== 'function' ) { return; }

    const rect = section.getBoundingClientRect(); console.log(rect);



    const viewportHeight =
      window.innerHeight || 0;

    if (rect.top < viewportHeight - 100) {

      this.started = true;

      this.startCounting();
    }
  }

  startCounting(): void {

    this.counters.forEach(counter => {

      if (counter.static) {
        return;
      }

      const increment =
        counter.target / 100;

      const updateCounter = () => {

        if (counter.value < counter.target) {

          counter.value += increment;

          counter.value =
            Math.floor(counter.value);

          requestAnimationFrame(updateCounter);

        } else {

          counter.value = counter.target;
        }
      };

      updateCounter();
    });
  }

  getDisplay(counter: any): string {

    if (counter.static) {
      return '24/7';
    }

    if (counter.target >= 100000) {

      return (
        (counter.value / 100000).toFixed(0)
        + '+ Lakhs'
      );
    }

    return counter.value + counter.suffix;
  }
}
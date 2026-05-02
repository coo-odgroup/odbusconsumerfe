import { Component, OnInit, HostListener, ElementRef } from '@angular/core';

@Component({
  selector: 'app-growing',
  templateUrl: './growing.component.html',
  styleUrls: ['./growing.component.css', '../home.component.css']
})
export class GrowingComponent implements OnInit {

  started = false;

  counters = [
    { value: 0, target: 2500, suffix: '+', label: 'Routes' },
    { value: 0, target: 2200, suffix: '+', label: 'Buses' },
    { value: 0, target: 1000000, suffix: '+', label: 'Satisfied Customers' },
    { value: 24, target: 24, suffix: '/7', label: 'Customer Service', static: true } // ✅ static
  ];

  constructor(private el: ElementRef) { }

  ngOnInit(): void { }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.started) return;

    const section = this.el.nativeElement.querySelector('.stats-section');
    if (!section) return;

    const rect = section.getBoundingClientRect();

    if (rect.top < window.innerHeight - 100) {
      this.startCounting();
      this.started = true;
    }
  }

  startCounting() {
    this.counters.forEach(counter => {

      if (counter.static) return; 

      const step = counter.target / 100;

      const update = () => {
        if (counter.value < counter.target) {
          counter.value += step;
          counter.value = Math.floor(counter.value);
          requestAnimationFrame(update);
        } else {
          counter.value = counter.target;
        }
      };

      update();
    });
  }

  getDisplay(counter: any): string {
    if (counter.static) return '24/7';

    if (counter.target >= 100000) {
      return (counter.value / 100000).toFixed(0) + '+ Lakhs';
    }

    return counter.value + counter.suffix;
  }
}
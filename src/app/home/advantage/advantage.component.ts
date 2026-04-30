import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-advantage',
  templateUrl: './advantage.component.html',
  styleUrls: ['./advantage.component.css', '../home.component.css']
})
export class AdvantageComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  moveSlider(direction: number) {
    const slider: any = document.getElementById('cardsScroll');
    if (!slider) return;

    const scrollAmount = 420; // card move distance

    slider.scrollTo({
      left: slider.scrollLeft + direction * scrollAmount,
      behavior: 'smooth',
    });

    setTimeout(() => {
      this.updateSliderButtons();
    }, 500);
  }

  updateSliderButtons() {
    const slider: any = document.getElementById('cardsScroll');
    const prevBtn: any = document.querySelector('.prev-btn');
    const nextBtn: any = document.querySelector('.next-btn');

    if (!slider || !prevBtn || !nextBtn) return;

    /* LEFT BUTTON */
    if (slider.scrollLeft <= 5) {
      prevBtn.style.display = 'none';
    } else {
      prevBtn.style.display = 'flex';
    }

    /* RIGHT BUTTON */
    if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 5) {
      nextBtn.style.display = 'none';
    } else {
      nextBtn.style.display = 'flex';
    }
  }
}

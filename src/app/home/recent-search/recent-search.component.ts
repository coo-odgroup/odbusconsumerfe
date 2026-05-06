import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recent-search',
  templateUrl: './recent-search.component.html',
  styleUrls: ['./recent-search.component.css', '../home.component.css'],
})
export class RecentSearchComponent implements OnInit {
  constructor() {}

  recentSearches: any[] = [];

  ngOnInit(): void {
    const storedSearches = localStorage.getItem('recentSearches');

    if (storedSearches) {
      this.recentSearches = JSON.parse(storedSearches);
    }
  }

  formatDate(date: string): Date {
    const parts = date.split('-');
    return new Date(+parts[2], +parts[1] - 1, +parts[0]);
  }
}

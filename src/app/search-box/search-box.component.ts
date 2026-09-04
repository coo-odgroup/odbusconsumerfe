import {
  Component,
  OnInit,
  Inject,
  PLATFORM_ID,
  HostListener,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { CommonService } from '../services/common.service';
import { TemplateRef, ViewChild } from '@angular/core';
import { GlobalConstants } from '../constants/global-constants';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.css'],
})
export class SearchBoxComponent implements OnInit {
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (!target.closest('.custom-date-picker')) {
      this.calendarOpen = false;
    }
  }

  // =======================
  // CUSTOM CALENDAR
  // =======================

  calendarOpen = false;

  calendarSelectedDate: Date | null = null;

  selectedDateText = '';

  currentDate = new Date();

  currentMonth = this.currentDate.getMonth();

  currentYear = this.currentDate.getFullYear();

  calendarDays: any[] = [];

  monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  searchForm!: FormGroup;

  location_list: any = [];

  swapsource: any;
  swapdestination: any;

  search: any;
  formatter: any;

  isMobile: boolean = false;

  entry_date: any = null;

  @ViewChild('rt') rt!: TemplateRef<any>;
  @ViewChild('rt2') rt2!: TemplateRef<any>;

  private apiurl = GlobalConstants.BASE_URL;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private commonService: CommonService,
    private notify: NotificationService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit() {
    this.searchForm = this.fb.group({
      source: [null],
      destination: [null],
      entry_date: [null],
    });

    const popularInfo = this.commonService.getPopularInfo();

    if (popularInfo) {
      this.location_list = popularInfo.locationName || [];
    }

    this.search = (text$: Observable<string>) =>
      text$.pipe(
        debounceTime(200),
        map((term) =>
          term === ''
            ? []
            : this.location_list
                .filter((v: any) =>
                  v.name.toLowerCase().includes(term.toLowerCase()),
                )
                .slice(0, 10),
        ),
      );

    this.formatter = (x: any) => x.name;

    this.generateCalendar();
  }

  toggleCalendar() {
    // console.log('toggleCalendar called');
    this.calendarOpen = !this.calendarOpen;

    if (this.calendarOpen) {
      this.generateCalendar();
    }

    // console.log(this.calendarOpen);
  }

  // generateCalendar() {

  //   this.calendarDays = [];

  //   const firstDay = new Date(this.currentYear, this.currentMonth, 1);

  //   const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);

  //   const firstWeekDay = firstDay.getDay();

  //   const totalDays = lastDay.getDate();

  //   for (let i = 0; i < firstWeekDay; i++) {

  //     this.calendarDays.push(null);

  //   }

  //   const today = new Date();

  //   for (let d = 1; d <= totalDays; d++) {

  //     const fullDate = new Date(this.currentYear, this.currentMonth, d);

  //     const isToday =
  //       fullDate.toDateString() === today.toDateString();

  //     const selected =
  //       this.calendarSelectedDate &&
  //       fullDate.toDateString() === this.calendarSelectedDate.toDateString();

  //     const disabled = fullDate < new Date(
  //       today.getFullYear(),
  //       today.getMonth(),
  //       today.getDate()
  //     );

  //     this.calendarDays.push({

  //       date: d,

  //       fullDate,

  //       today: isToday,

  //       selected,

  //       disabled

  //     });

  //   }

  // }

  generateCalendar() {
    this.calendarDays = [];

    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);

    const firstWeekDay = firstDay.getDay();
    const totalDays = lastDay.getDate();

    for (let i = 0; i < firstWeekDay; i++) {
      this.calendarDays.push(null);
    }

    const today = new Date();

    // Remove time portion
    const minDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );

    // Allow booking till exactly 1 month from today
    // const maxDate = new Date(
    //   today.getFullYear(),
    //   today.getMonth() + 1,
    //   today.getDate(),
    // );

    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + parseInt(localStorage.getItem('advance_days_show') || '29'));

    for (let d = 1; d <= totalDays; d++) {
      const fullDate = new Date(this.currentYear, this.currentMonth, d);

      const isToday = fullDate.toDateString() === today.toDateString();

      const selected =
        this.calendarSelectedDate &&
        fullDate.toDateString() === this.calendarSelectedDate.toDateString();

      // Disable dates before today OR after one month
      const disabled = fullDate < minDate || fullDate > maxDate;

      this.calendarDays.push({
        date: d,
        fullDate,
        today: isToday,
        selected,
        disabled,
      });
    }
  }

  previousMonth() {
    this.currentMonth--;

    if (this.currentMonth < 0) {
      this.currentMonth = 11;

      this.currentYear--;
    }

    this.generateCalendar();
  }

  nextMonth() {
    this.currentMonth++;

    if (this.currentMonth > 11) {
      this.currentMonth = 0;

      this.currentYear++;
    }

    this.generateCalendar();
  }

  selectDate(day: any) {
    if (!day || day.disabled) return;

    this.calendarSelectedDate = day.fullDate;

    const dd = ('0' + day.fullDate.getDate()).slice(-2);

    const mm = ('0' + (day.fullDate.getMonth() + 1)).slice(-2);

    const yyyy = day.fullDate.getFullYear();

    // Display in input
    this.selectedDateText = `${dd}-${mm}-${yyyy}`;

    // Store in Reactive Form
    this.searchForm.patchValue({
      entry_date: `${dd}-${mm}-${yyyy}`,
    });

    this.calendarOpen = false;

    this.generateCalendar();
  }

  selectToday() {
    const today = new Date();

    this.currentMonth = today.getMonth();

    this.currentYear = today.getFullYear();

    this.selectDate({
      fullDate: today,
      date: today.getDate(),
      disabled: false,
    });
  }

  selectTomorrow() {
    const tomorrow = new Date();

    tomorrow.setDate(tomorrow.getDate() + 1);

    this.currentMonth = tomorrow.getMonth();

    this.currentYear = tomorrow.getFullYear();

    this.selectDate({
      fullDate: tomorrow,
      date: tomorrow.getDate(),
      disabled: false,
    });
  }

  swap() {
    const temp = this.swapsource;
    this.swapsource = this.swapdestination;
    this.swapdestination = temp;
  }

  submitForm() {
    if (this.isMobile == true && this.entry_date != null) {
      this.searchForm.patchValue({
        entry_date: this.entry_date,
      });
    }

    if (!this.searchForm.value.source) {
      this.notify.notify('Enter Source !', 'Error');
      return;
    }

    if (!this.searchForm.value.destination) {
      this.notify.notify('Enter Destination !', 'Error');
      return;
    }

    if (!this.searchForm.value.entry_date) {
      this.notify.notify('Enter Journey Date !', 'Error');
      return;
    }

    if (
      this.searchForm.value.source ===
      this.searchForm.value.destination
    ) {
      this.notify.notify(
        'Source and Destination cannot be the same !',
        'Error',
      );
      return false;
    }

    let dt = this.searchForm.value.entry_date;
    let formattedDate = '';

    // Case 1: Quick button already gives string
    if (typeof dt === 'string') {
      formattedDate = dt;
    }

    // Case 2: Datepicker gives object
    else if (dt.day && dt.month && dt.year) {
      let day = String(dt.day).padStart(2, '0');
      let month = String(dt.month).padStart(2, '0');

      formattedDate = `${day}-${month}-${dt.year}`;
    } else {
      this.notify.notify('Invalid Date !', 'Error');
      return;
    }

    this.searchForm.patchValue({
      entry_date: formattedDate,
    });

    let sr = this.searchForm.value.source.url;
    let ds = this.searchForm.value.destination.url;

    if (!this.searchForm.value.source.name) {
      this.notify.notify('Select Valid Source !', 'Error');
      return;
    }

    if (!this.searchForm.value.destination.name) {
      this.notify.notify('Select Valid Destination !', 'Error');
      return;
    }

    this.saveSearchHistory(sr, ds, formattedDate);

    this.router.navigateByUrl(
      `/routes/${sr}-${ds}-bus-services?date=${formattedDate}`
    );
  }

  searchToday() {
    const today = new Date();

    this.searchForm.patchValue({
      entry_date: this.formatDate(today),
    });

    this.submitForm();
  }

  searchTomorrow() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    this.searchForm.patchValue({
      entry_date: this.formatDate(tomorrow),
    });

    this.submitForm();
  }

  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

  saveSearchHistory(sr: string, ds: string, date: string) {
    const newSearch = {
      source: sr,
      destination: ds,
      date: date,
      url: `routes/${sr}-${ds}-bus-services?date=${date}`,
      searchedAt: new Date().toISOString(),
    };

    let history = JSON.parse(localStorage.getItem('recentSearches') || '[]');

    // Find same source + destination
    const existingIndex = history.findIndex(
      (item: any) => item.source === sr && item.destination === ds,
    );

    if (existingIndex !== -1) {
      // Remove old record
      history.splice(existingIndex, 1);
    }

    // Add updated/new record at top
    history.unshift(newSearch);

    // Keep only latest 5
    history = history.slice(0, 5);

    localStorage.setItem('recentSearches', JSON.stringify(history));
  }

  tabChange(val: any) {
    // Guard DOM access for SSR: only manipulate DOM in browser and if element exists
    if (isPlatformBrowser(this.platformId)) {
      const el = document.getElementById(val);
      if (el) {
        try {
          el.focus();
        } catch (e) {}
        try {
          el.click();
        } catch (e) {}
      }
    }
  }
}

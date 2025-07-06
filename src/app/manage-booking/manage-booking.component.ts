import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';
import { ManagebookingService } from '../services/managebooking.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DeviceDetectorService } from 'ngx-device-detector';
import { LoginChecker } from '../helpers/loginChecker';
import { SeoService } from '../services/seo.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-manage-booking',
  templateUrl: './manage-booking.component.html',
  styleUrls: ['./manage-booking.component.css'],
})
export class ManageBookingComponent implements OnInit {
  bookForm: FormGroup;

  submitted = false;
  MenuActive: boolean = false;

  @Input() session: LoginChecker;
  isMobile: boolean;

  bookingDetails: any = [];
  currentUrl: string;
  activeMenu: string;

  constructor(
    public router: Router,
    public fb: FormBuilder,
    private notify: NotificationService,
    private managebookingService: ManagebookingService,
    private spinner: NgxSpinnerService,
    private seo: SeoService,
    private location: Location,
    private deviceService: DeviceDetectorService
  ) {
    this.isMobile = this.deviceService.isMobile();

    this.session = new LoginChecker();

    this.currentUrl = location.path().replace('/', '');
    this.seo.seolist(this.currentUrl);

    localStorage.removeItem('bookingDetails');

    this.bookForm = this.fb.group({
      pnr: ['', Validators.required],
      mobile: [
        '',
        [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')],
      ],
    });
  }

  get f() {
    return this.bookForm.controls;
  }

  menu() {
    this.MenuActive = (this.MenuActive==false) ? true : false;
    this.activeMenu='';   
  }

  signOut() {
    this.session.logout();
    this.router.navigate(['login']);
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.bookForm.invalid) {
      return;
    } else {
      this.spinner.show();
      const request = {
        pnr: this.bookForm.value.pnr,
        mobile: this.bookForm.value.mobile,
      };
      this.managebookingService.getbookingdetails(request).subscribe(
        (res) => {
          if (res.status == 1) {
            localStorage.setItem('bookingDetails', JSON.stringify(res.data[0]));
            this.router.navigate(['manage-booking-detail']);
          }
          if (res.status == 0) {
            this.notify.notify(res.message, 'Error');
          }

          this.spinner.hide();
        },
        (error) => {
          this.spinner.hide();
          this.notify.notify(error.error.message, 'Error');
        }
      );
    }
  }

  onlyNumbers(event: any) {
    var e = event;
    var charCode = e.which || e.keyCode;

    if (
      (charCode >= 48 && charCode <= 57) ||
      (charCode >= 96 && charCode <= 105) ||
      charCode == 8 ||
      charCode == 9
    )
      return true;
    return false;
  }

  ngOnInit(): void {}
}

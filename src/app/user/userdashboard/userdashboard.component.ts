import { Component, Input, OnInit } from '@angular/core';
import { UserdataService } from '../../services/userdata.service';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificationService } from '../../services/notification.service';
import { NgbDatepickerConfig, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LocationdataService } from '../../services/locationdata.service';
import { Router } from '@angular/router';
import { LoginChecker } from '../../helpers/loginChecker';
import { ManagebookingService } from '../../services/managebooking.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalConstants } from 'src/app/constants/global-constants';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-userdashboard',
  templateUrl: './userdashboard.component.html',
  styleUrls: ['./userdashboard.component.css'],
  providers: [NgbActiveModal, DatePipe]
})
export class UserdashboardComponent implements OnInit {

  baseUrl = GlobalConstants.BASE_URL;

  expandedRefundRow: string | null = null;
  refundStatus: any;

  toggleRefund(pnr: string, id: any) {
    this.expandedRefundRow =
      this.expandedRefundRow === pnr ? null : pnr;

    if (this.expandedRefundRow) {
      this.spinner.show();
      const data = {
        booking_id: id
      };

      this.http.post(this.baseUrl + "/fetchRefundStatus", data).subscribe((res: any) => {
        const booking = this.list.data.find((x: any) => x.pnr === pnr);
        if (booking) {
          booking.refundData = res.data;
        }

        this.spinner.hide();

        console.log(booking.refundData);
      });
    }
  }

  getStep(b: any) {
    const statuses = b.refundData || [];

    return {
      request: statuses.find((s: any) => s.refund_status === 0),
      processing: statuses.find((s: any) => s.refund_status === 1),
      refunded: statuses.find((s: any) => s.refund_status === 3),
    };
  }

  list: any = [];
  per_page = 10;


  @Input() session: LoginChecker;

  statusLabel: any = '';
  profile: any;
  cancelInfo: any;

  pnr: any;
  bus_id: any;

  OverallRate = 0;
  ComfortRate = 0;
  CleanRate = 0;
  BehaviourRate = 0;
  TimingRate = 0;


  reviewForm: FormGroup;
  submitted = false;
  user: any;

  isMobile: boolean;
  MenuActive: boolean = false;
  currentDate: any;
  activeMenu: string;

  constructor(
    private userdataservice: UserdataService,
    private spinner: NgxSpinnerService,
    private notify: NotificationService,
    private dtconfig: NgbDatepickerConfig,
    private router: Router,
    private locationService: LocationdataService,
    private managebookingService: ManagebookingService,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    public fb: FormBuilder,
    private deviceService: DeviceDetectorService,
    private datePipe: DatePipe,
    private http: HttpClient
  ) {
    this.currentDate = this.datePipe.transform((new Date), 'yyyy-MM-dd');
    //console.log(this.currentDate);
    this.isMobile = this.deviceService.isMobile();
    this.session = new LoginChecker();
    // this.user = JSON.parse(localStorage.getItem('user'));

    // this.getList();
    // this.profileData();

    const current = new Date();
    this.dtconfig.minDate = {
      year: current.getFullYear(), month:
        current.getMonth() + 1, day: current.getDate()
    };

    this.reviewForm = this.fb.group({
      comments: ['', Validators.required],
      title: ['', Validators.required]
    })
  }


  menu() {
    this.MenuActive = (this.MenuActive == false) ? true : false;
    this.activeMenu = '';
  }

  signOut() {
    this.session.logout();
    this.router.navigate(['login']);
  }

  viewTicket(pnr: any) {

    const request = {
      "pnr": pnr,
      "mobile": this.profile.phone
    };


    this.managebookingService.getbookingdetails(request).subscribe(
      res => {
        if (res.status == 1) {
          localStorage.setItem('bookingDetails', JSON.stringify(res.data[0]));
          // this.router.navigate(['manage-booking-detail']);
          this.router.navigate(['pnr', pnr]);
        }
        if (res.status == 0) {
          this.notify.notify(res.message, "Error");
        }

        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
        this.notify.notify(error.error.message, "Error");
      });

  }

  profileData() {

    this.spinner.show();
    this.profile = JSON.parse(localStorage.getItem('user') || 'null');

    this.session = new LoginChecker();
    this.userdataservice.getProfile(this.profile.id, this.profile.token).subscribe(
      res => {
        if (res.status == 0) {
          this.session.logout();
          this.router.navigate(['login']);
        }
      });

  }

  // getList(url: any = '', status: any = '') {

  //   this.expandedRefundRow = null;
  //   this.spinner.show();

  //   this.statusLabel = status;
  //   const param = {
  //     "status": status,
  //     "paginate": this.per_page,
  //     "userId": this.user.id,
  //     "token": this.user.token
  //   };


  //   this.userdataservice.BookingHistroy(url, param).subscribe(
  //     res => {
  //       if (res.status == 1) {
  //         this.list = res.data.data;
  //         //console.log(this.list);
  //       }
  //       this.spinner.hide();

  //     },
  //     error => {
  //       this.spinner.hide();
  //       //this.notify.notify("Login is expired","Error");
  //     }
  //   );
  // }

  allBookings: any[] = [];
  filteredBookings: any[] = [];

  paginatedBookings: any[] = [];

  currentPage: number = 1;
  totalPages: number = 1;

  getList(url: any = '', status: any = '') {

    this.expandedRefundRow = null;
    this.statusLabel = status;

    // API only once
    if (this.allBookings.length === 0) {

      this.spinner.show();

      const param = {
        status: '',
        paginate: 10000,
        userId: this.user.id,
        token: this.user.token
      };

      this.userdataservice.BookingHistroy('', param).subscribe(
        (res: any) => {

          this.spinner.hide();

          if (res.status == 1) {

            // Get ALL bookings
            this.allBookings = res.data?.data?.data || [];

            // Filter
            if (status) {
              this.filteredBookings = this.allBookings.filter(
                (booking: any) =>
                  booking.booking_status === status
              );
            } else {
              this.filteredBookings = [...this.allBookings];
            }
            this.currentPage = 1;

            this.applyPagination();
          }
        },
        error => {
          this.spinner.hide();
          console.error('API ERROR:', error);
        }
      );

    } else {

      // NO API CALL

      if (status) {

        this.filteredBookings = this.allBookings.filter(
          (booking: any) =>
            booking.booking_status === status
        );

      } else {

        this.filteredBookings = [...this.allBookings];
      }

      // When filter changes, go to page 1
      this.currentPage = 1;

      // Apply pagination
      this.applyPagination();
    }
  }

  filterBookings(status: string) {

    this.statusLabel = status;

    if (!status) {
      this.filteredBookings = [...this.allBookings];
    } else {
      this.filteredBookings = this.allBookings.filter(
        (booking: any) =>
          booking.booking_status === status
      );
    }

    // Filter change → page 1
    this.currentPage = 1;

    this.applyPagination();
  }

  applyPagination() {

    this.totalPages = Math.max(
      1,
      Math.ceil(this.filteredBookings.length / this.per_page)
    );

    const start = (this.currentPage - 1) * this.per_page;
    const end = start + this.per_page;

    this.paginatedBookings =
      this.filteredBookings.slice(start, end);
  }

  goToPage(page: number) {

    if (page < 1 || page > this.totalPages) {
      return;
    }

    this.currentPage = page;

    this.applyPagination();
  }

  getPageNumbers(): number[] {
    return Array.from(
      { length: this.totalPages },
      (_, i) => i + 1
    );
  }

  page(label: any) {
    return label;
  }


  cancel_ticket() {
    this.spinner.show();
    const request = {
      "pnr": this.pnr,
      "phone": this.profile.phone
    };


    this.managebookingService.cancelTicket(request).subscribe(
      res => {

        if (res.status == 1) {
          this.notify.notify(res.message, "Success");
          this.getList();
          this.modalService.dismissAll();
        }

        if (res.status == 0) {
          this.notify.notify(res.message, "Error");
        }

        this.spinner.hide();

      },
      error => {
        this.spinner.hide();
        this.notify.notify(error.error.message, "Error");
      }
    );


  }

  cancelTicketTab(pnr: any, content: any) {

    this.pnr = pnr;
    this.spinner.show();

    const request = {
      "pnr": this.pnr,
      "mobile": this.profile.phone
    };

    this.managebookingService.getcancelTicketInfo(request).subscribe(
      res => {

        if (res.status == 1) {
          if (typeof res.data === 'string') {
            this.notify.notify(res.data, "Error");
          }

          if (typeof res.data === 'object') {
            this.open(content);
            this.cancelInfo = res.data;
          }
        }

        if (res.status == 0) {
          this.notify.notify(res.message, "Error");
        }

        this.spinner.hide();

      },
      error => {
        this.spinner.hide();
        this.notify.notify(error.error.message, "Error");
      }
    );
  }

  open(content: any) {
    this.modalService.open(content);
  }


  sourceData: any;
  destinationData: any;
  bookAgain(sr: any, ds: any) {
    this.spinner.show();

    this.locationService.all().subscribe(
      res => {
        if (res.status == 1) {
          res.data.filter((itm) => {

            if (sr === itm.name) {
              this.sourceData = itm;
            }

            if (ds === itm.name) {
              this.destinationData = itm;
            }

          });

          let dt = (<HTMLInputElement>document.getElementById("todayDate")).value;
          this.listing(this.sourceData, this.destinationData, dt);

        }
      });

    this.spinner.hide();

  }

  listing(s: any, d: any, dt: any) {
    this.locationService.setSource(s);
    this.locationService.setDestination(d);
    this.locationService.setDate(dt);
    this.router.navigate(['/listing']);
  }

  addReview(pnr: any, bus_id: any, review: any) {
    this.pnr = pnr;
    this.bus_id = bus_id;
    this.modalService.open(review, { size: 'lg' });

  }

  get f() { return this.reviewForm.controls; }

  onSubmit() {

    this.submitted = true;

    // stop here if form is invalid
    if (this.reviewForm.invalid) {
      return;
    } else {

      this.spinner.show();

      const reviewData = {
        "pnr": this.pnr,
        "bus_id": this.bus_id,
        "users_id": this.profile.id,
        "reference_key": (this.profile.email == null) ? this.profile.phone : this.profile.email,
        "rating_overall": this.OverallRate,
        "rating_comfort": this.ComfortRate,
        "rating_clean": this.CleanRate,
        "rating_behavior": this.BehaviourRate,
        "rating_timing": this.TimingRate,
        "comments": this.reviewForm.value.comments,
        "title": this.reviewForm.value.title,
        "user_id": GlobalConstants.MASTER_SETTING_USER_ID,
        "created_by": this.profile.name
      };

      // console.log(reviewData);

      this.userdataservice.addreview(reviewData).subscribe(
        res => {
          // console.log(res);
          if (res.status == 1) {
            this.modalService.dismissAll();
            this.notify.notify(res.message, "Success");
            this.router.navigate(['/my-reviews']);
          }

          this.spinner.hide();
        },
        error => {
          this.spinner.hide();
          this.notify.notify(error.error, "Error");
        }
      );
    }
  }

  ngOnInit(): void {

    this.user = JSON.parse(
      localStorage.getItem('user') || 'null'
    );

    if (!this.user?.id || !this.user?.token) {
      this.router.navigate(['/login']);
      return;
    }

    this.getList();
    this.profileData();
  }

  bookAgainV2(sourceUrl: string, destinationUrl: string) {
    this.spinner.show();

    const url = `/routes/${sourceUrl}-${destinationUrl}-bus-services`;

    this.router.navigateByUrl(url);

    this.spinner.hide();
  }
}
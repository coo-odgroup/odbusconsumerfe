import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  HostListener,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocationdataService } from '../services/locationdata.service';
import { PopularRoutesService } from '../services/popular-routes.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SeoService } from '../services/seo.service';
import { Location, isPlatformBrowser } from '@angular/common';
import { LoginChecker } from '../helpers/loginChecker';
import { DeviceDetectorService } from 'ngx-device-detector';
import {
  NgbDatepickerConfig,
  NgbModal,
  NgbActiveModal,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.css'],
  providers: [NgbActiveModal],
})
export class RoutesComponent implements OnInit, AfterViewInit {
  @ViewChildren('theLastlist', { read: ElementRef })
  theLastlist: QueryList<ElementRef>;

  observer: any;

  all_routes: any = [];

  source_id: any;
  destination_id: any;
  currentUrl: any;
  searchText: string;

  isMobile: boolean;
  session: LoginChecker;
  MenuActive: boolean = false;
  activeMenu: string;
  per_page: number = 30;
  page_no: number = 1;
  totalPage: number;

  constructor(
    private router: Router,
    private _fb: FormBuilder,
    private locationService: LocationdataService,
    public dtconfig: NgbDatepickerConfig,
    private spinner: NgxSpinnerService,
    private seo: SeoService,
    private location: Location,
    private popularRoutesService: PopularRoutesService,
    private modalService: NgbModal,
    private detectService: DeviceDetectorService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.isMobile = this.detectService.isMobile();
    this.session = new LoginChecker();
    this.currentUrl = location.path().replace('/', '');
    this.seo.seolist(this.currentUrl);

    const current = new Date();
    this.dtconfig.minDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate(),
    };
  }
  ngAfterViewInit() {
    this.theLastlist.changes.subscribe((d) => {
      if (d.last) {
        this.observer.observe(d.last.nativeElement);
      }
    });
  }

  menu() {
    this.MenuActive = this.MenuActive == false ? true : false;
    this.activeMenu = '';
  }

  signOut() {
    this.session.logout();
    this.router.navigate(['login']);
  }

  goBack() {
    this.location.back();
  }

  // allRoutes() {
  //   this.spinner.show();
  //   this.popularRoutesService
  //     .allroutes(this.per_page, this.page_no)
  //     .subscribe((res) => {
  //       //console.log(res);

  //       if (res.status == 1) {
  //         this.totalPage = res.data.total;

  //         let result = res.data.data;
  //         if (typeof result === 'object') {
  //           result = Object.values(result);
  //         }
  //         result.forEach((element) => {
  //           this.all_routes.push(element);
  //         });
  //       }
  //       this.spinner.hide();
  //     });
  // }

  loading = false;
  hasMore = true;

  allRoutes(search: string = '') {
    if (this.loading || !this.hasMore) {
      return;
    }

    this.loading = true;
    this.spinner.show();

    this.popularRoutesService
      .getallroutes(this.per_page, this.page_no, search)
      .subscribe({
        next: (res: any) => {
          let result = res?.data?.data || [];

          if (this.page_no === 1) {
            this.all_routes = result; // first page
          } else {
            this.all_routes.push(...result); // load more
          }

          if (result.length < this.per_page) {
            this.hasMore = false;
          } else {
            this.page_no++;
          }

          this.loading = false;
          this.spinner.hide();
        },
        error: () => {
          this.loading = false;
          this.spinner.hide();
        },
      });
  }

  searchRoutes() {
    const search = this.searchText?.trim() || '';

    if (search.length < 3 && search.length > 0) {
      return;
    }

    this.page_no = 1;
    this.hasMore = true;
    this.allRoutes(search);
  }

  sourceData: any;
  destinationData: any;

  popularSearch(sr: any, ds: any) {
    this.spinner.show();

    this.locationService.all().subscribe((res) => {
      if (res.status == 1) {
        res.data.filter((itm: { url: any }) => {
          if (sr === itm.url) {
            this.sourceData = itm;
          }

          if (ds === itm.url) {
            this.destinationData = itm;
          }
        });

        // let dt = (<HTMLInputElement>document.getElementById('todayDate')).value;
        //this.listing(this.sourceData,this.destinationData,dt);
        this.router.navigate(['routes/' + sr + '-' + ds + '-bus-services']);
      }
    });

    this.spinner.hide();
  }

  buses: any[];

  ViewBus(buses: any, buslist) {
    this.buses = buses;

    this.modalService.open(buslist, { centered: true });
  }

  listing(s: any, d: any, dt: any) {
    this.locationService.setSource(s);
    this.locationService.setDestination(d);
    this.locationService.setDate(dt);
    this.router.navigate(['/listing']);
  }

  IntersectionObserver() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Optional extra safety
    if (!('IntersectionObserver' in window)) {
      return;
    }

    let options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    this.observer = new IntersectionObserver((e) => {
      if (e[0].isIntersecting) {
        if (this.page_no < this.totalPage) {
          this.page_no++;
          this.allRoutes();
        }
      }
    }, options);
  }

  ngOnInit(): void {
    this.allRoutes();
    this.IntersectionObserver();
  }
}

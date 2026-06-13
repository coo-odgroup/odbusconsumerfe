import { Component, OnInit } from '@angular/core';
import { PagesService } from '../services/pages.service';
import { GlobalConstants } from '../constants/global-constants';
import { SeoService } from '../services/seo.service';
import { Location } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { DeviceDetectorService } from 'ngx-device-detector';
import { LoginChecker } from '../helpers/loginChecker';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-bloglisting',
  templateUrl: './bloglisting.component.html',
  styleUrls: ['./bloglisting.component.css'],
})
export class BlogListingComponent implements OnInit {
  pageTitle: any;
  pageContent: any;
  currentUrl: any;
  isMobile: boolean;

  session: LoginChecker;

  MenuActive: boolean = false;
  activeMenu: string = '';

  blogData: any;
  categoryData: any;
  slug: any;
  tag_slug: any;
  author_slug: any;

  private apiURL = GlobalConstants.BASE_URL;
  baseurl = GlobalConstants.PATHURL;

  constructor(
    private pagesService: PagesService,
    private seo: SeoService,
    private location: Location,
    private spinner: NgxSpinnerService,
    private router: Router,
    private deviceService: DeviceDetectorService,
    private http: HttpClient,
    private route: ActivatedRoute,
  ) {
    this.isMobile = this.deviceService.isMobile();
    this.session = new LoginChecker();

    this.currentUrl = location.path().replace('/', '');
    // console.log(this.currentUrl);

    this.seo.seolist(this.currentUrl);
  }

  menu() {
    this.MenuActive = this.MenuActive ? true : false;
    this.activeMenu = '';
  }

  signOut() {
    this.session.logout();
    this.router.navigate(['login']);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.slug = params.get('slug');
      this.tag_slug = params.get('tag_slug');
      this.author_slug = params.get('author_slug');
      this.loadBlogs(this.slug, this.tag_slug, this.author_slug);
    });
  }

  loadBlogs(slug: any, tag_slug: any, author_slug: any) {
    this.spinner.show();

    const formData = new FormData();

    formData.append('cat_slug', slug || '');
    formData.append('tag_slug', tag_slug || '');
    formData.append('author_slug', author_slug || '');

    this.http.post(this.apiURL + '/bloglist', formData).subscribe(
      (res: any) => {
        this.blogData = res.data.blogs;
        this.categoryData = res.data.categories;
        this.spinner.hide();
      },
      (error) => {
        console.error('API Error:', error);
        this.spinner.hide();
      },
    );
  }
}

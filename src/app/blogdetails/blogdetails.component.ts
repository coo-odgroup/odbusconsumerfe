import { Component, OnInit } from '@angular/core';
import { PagesService } from '../services/pages.service';
import { GlobalConstants } from '../constants/global-constants';
import { SeoService } from '../services/seo.service';
import { Location } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { DeviceDetectorService } from 'ngx-device-detector';
import { LoginChecker } from '../helpers/loginChecker';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-blogdetails',
  templateUrl: './blogdetails.component.html',
  styleUrls: ['./blogdetails.component.css'],
})
export class BlogDetailComponent implements OnInit {

  pageTitle: any;
  pageContent: any;
  currentUrl: any;
  isMobile: boolean;

  session: LoginChecker;

  MenuActive: boolean = false;
  activeMenu: string = '';

  slug: any;
  blogDetail: any;
  blogcat: any;
  related_blogs: any;

  private apiUrl = GlobalConstants.BASE_URL;
  baseurl = GlobalConstants.PATHURL;

  constructor(
    private seo: SeoService,
    private location: Location,
    private spinner: NgxSpinnerService,
    private router: Router,
    private deviceService: DeviceDetectorService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private meta: Meta,
    private title: Title,
  ) {

    this.isMobile = this.deviceService.isMobile();
    this.session = new LoginChecker();

    this.seo.seolist(this.currentUrl);
  }

  menu() {
    this.MenuActive = this.MenuActive ? false : true;
    this.activeMenu = '';
  }

  signOut() {
    this.session.logout();
    this.router.navigate(['login']);
  }

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      this.slug = params.get('slug');
      this.loadBlogs(this.slug);

    });

  }

  loadBlogs(slug: any) {

    this.spinner.show();

    const reqData = { slug: slug };

    this.http.post(this.apiUrl + "/blogdetails", reqData).subscribe(
      (res: any) => {

        this.blogDetail = res.data.blogs;
        this.blogcat = res.data.categories;
        this.related_blogs = res.data.related_blogs;

        console.log(this.related_blogs);

        if (this.blogDetail) {
          this.applySeo(this.blogDetail);
        }

        this.spinner.hide();
      },
      (error) => {

        console.error("API Error:", error);

        this.spinner.hide();
      }
    );

  }

  applySeo(seo: any) {
    console.log(seo)
    this.title.setTitle(seo.meta_title || '');

    this.meta.updateTag({
      name: 'description',
      content: seo.meta_description || ''
    });

    this.meta.updateTag({
      name: 'keywords',
      content: seo.meta_keywords || ''
    });

    this.meta.updateTag({
      property: 'og:title',
      content: seo.meta_title || ''
    });
  }

  getdata() {
    alert('working');
  }

}
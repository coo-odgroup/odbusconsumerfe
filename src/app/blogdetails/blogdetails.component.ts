import { Component, OnInit,Inject  } from '@angular/core';
import { PagesService } from '../services/pages.service';
import { GlobalConstants } from '../constants/global-constants';
import { SeoService } from '../services/seo.service';
import { Location,DOCUMENT  } from '@angular/common';
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
    @Inject(DOCUMENT) private document: Document 
  ) {
    this.isMobile = this.deviceService.isMobile();
    this.session = new LoginChecker();

    this.seo.seolist(this.currentUrl);
  }

  breadcrumbSchema: any;

  menu() {
    this.MenuActive = this.MenuActive ? false : true;
    this.activeMenu = '';
  }

  signOut() {
    this.session.logout();
    this.router.navigate(['login']);
  }

  ngOnInit(): void {
    this.route.data.subscribe((data: any) => {
      const res = data.blogData;

      if (!res) {
        console.error('No data from resolver');
        return;
      }

      this.blogDetail = res.data.blogs;
      this.blogcat = res.data.categories;
      this.related_blogs = res.data.related_blogs;

      if (this.blogDetail) {
        this.applySeo(this.blogDetail);
      }
    });
  }

  // ngOnInit(): void {

  //   this.route.paramMap.subscribe(params => {
  //     this.slug = params.get('slug');
  //     this.loadBlogs(this.slug);

  //   });

  //   // if (this.blogDetail?.breadcrumb_schema) {
  //   //   try {
  //   //     this.breadcrumbSchema = JSON.parse(this.blogDetail.breadcrumb_schema);
  //   //   } catch (e) {
  //   //     console.error('Invalid JSON', e);
  //   //   }
  //   // }

  // }

  // setJsonLd(schema: any) {
  //   const script = document.createElement('script');
  //   script.type = 'application/ld+json';

  //   if (typeof schema === 'string') {
  //     try {
  //       const parsed = JSON.parse(schema);
  //       script.text = JSON.stringify(parsed);
  //     } catch (e) {
  //       console.error('Invalid JSON string', e);
  //       return;
  //     }
  //   } else {
  //     script.text = JSON.stringify(schema);
  //   }

  //   console.log(script);

  //   document.head.appendChild(script);
  // }

  removeOldJsonLd() {
    const scripts = this.document.querySelectorAll(
      'script[type="application/ld+json"]',
    );
    scripts.forEach((s) => s.remove());
  }

  loadBlogs(slug: any) {
    this.spinner.show();

    const reqData = { slug: slug };

    this.http.post(this.apiUrl + '/blogdetails', reqData).subscribe(
      (res: any) => {
        this.blogDetail = res.data.blogs;
        this.blogcat = res.data.categories;
        this.related_blogs = res.data.related_blogs;

        if (this.blogDetail) {
          this.applySeo(this.blogDetail);
        }

        this.spinner.hide();
      },
      (error) => {
        console.error('API Error:', error);

        this.spinner.hide();
      },
    );
  }

  applySeo(seo: any) {
    // console.log(seo);

    this.title.setTitle(seo.meta_title || '');

    this.meta.updateTag({
      name: 'description',
      content: seo.meta_description || '',
    });

    this.meta.updateTag({
      name: 'keywords',
      content: seo.meta_keywords || '',
    });

    this.meta.updateTag({
      property: 'og:title',
      content: seo.meta_title || '',
    });

    this.removeOldJsonLd();

    const schemas: any[] = [];

    if (seo?.breadcrumb_schema) {
      try {
        schemas.push(JSON.parse(JSON.parse(seo.breadcrumb_schema)));
      } catch (e) {
        console.error('Invalid breadcrumb JSON', e);
      }
    }

    if (seo?.faq_schema) {
      try {
        schemas.push(JSON.parse(JSON.parse(seo.faq_schema)));
      } catch (e) {
        console.error('Invalid FAQ JSON', e);
      }
    }

    if (seo?.service_schema) {
      try {
        schemas.push(JSON.parse(JSON.parse(seo.service_schema)));
      } catch (e) {
        console.error('Invalid service JSON', e);
      }
    }

    // 👉 Send all together
    if (schemas.length) {
      this.setJsonLdGraph(schemas);
    }
  }

  setJsonLdGraph(schemas: any[]) {
    const script = this.document.createElement('script');
    script.type = 'application/ld+json';

    const graph = {
      '@context': 'https://schema.org',
      '@graph': schemas,
    };

    script.text = JSON.stringify(graph);

    console.log(script);

    this.document.head.appendChild(script);
  }

  getdata() {
    alert('working');
  }
}

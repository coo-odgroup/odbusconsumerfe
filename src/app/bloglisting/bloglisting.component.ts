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

  blogContent: any;

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

    // this.currentUrl = location.path().replace('/', '');

    // this.seo.seolist(this.currentUrl);
  }

  menu() {
    this.MenuActive = this.MenuActive ? true : false;
    this.activeMenu = '';
  }

  signOut() {
    this.session.logout();
    this.router.navigate(['login']);
  }

  // ngOnInit(): void {

  //   // Get route parameters
  //   this.route.paramMap.subscribe((params) => {

  //     this.slug = params.get('slug');
  //     this.tag_slug = params.get('tag_slug');
  //     this.author_slug = params.get('author_slug');

  //     // Get query parameters
  //     this.route.queryParams.subscribe((queryParams) => {

  //       const page = queryParams['page'];

  //       if (!page || page === '1') {

  //         if (page === '1') {

  //           this.router.navigate([], {
  //             relativeTo: this.route,
  //             queryParams: {},
  //             replaceUrl: true
  //           });

  //         }

  //         // Load default blog page
  //         this.loadBlogs(
  //           this.slug,
  //           this.tag_slug,
  //           this.author_slug
  //         );

  //       }
  //       else {

  //         const pageUrl =
  //           this.apiURL + '/bloglist?page=' + page;

  //         this.getList(pageUrl);

  //       }

  //     });

  //   });


  //   const blogContent = localStorage.getItem('blogContent');

  //   if (blogContent) {

  //     const data = JSON.parse(blogContent);

  //     this.blogContent = data[0];

  //   } else {

  //     const param = {
  //       user_id: GlobalConstants.MASTER_SETTING_USER_ID,
  //       page_url: 'blog',
  //     };

  //     this.pagesService.PageContent(param).subscribe((res) => {

  //       localStorage.setItem(
  //         'blogContent',
  //         JSON.stringify(res.data)
  //       );

  //       this.blogContent = res.data[0];

  //     });

  //   }

  //   console.log('blogContent:', this.blogContent);
  // }

  ngOnInit(): void {

    this.route.paramMap.subscribe((params) => {

      this.slug = params.get('slug');
      this.tag_slug = params.get('tag_slug');
      this.author_slug = params.get('author_slug');

      this.route.queryParams.subscribe((queryParams) => {

        const page = queryParams['page'];

        // Always get the default SEO data for /blog
        this.seo.seolist('/blog').subscribe((response: any) => {

          if (response && response.data) {

            let metaTitle = response.data.meta_title;

            // Add page number only for pagination
            if (page && Number(page) > 1) {
              metaTitle = metaTitle + ' | Page ' + page;
            }

            // Set dynamic title
            this.seo.setPageTitle(metaTitle);

            // Keep normal description
            // this.seo.setPageDescription(
            //   response.data.meta_description
            // );

            // Keep your existing canonical logic
            this.seo.addCanonicalUrl();
          }

        });


        // Blog listing
        if (!page || page === '1') {

          if (page === '1') {
            this.router.navigate([], {
              relativeTo: this.route,
              queryParams: {},
              replaceUrl: true
            });

            return;
          }

          this.loadBlogs(
            this.slug,
            this.tag_slug,
            this.author_slug
          );

        } else {

          const pageUrl =
            this.apiURL + '/bloglist?page=' + page;

          this.getList(pageUrl);
        }

      });

    });


    // -----------------------------------------
    // Blog static content
    // -----------------------------------------

    const blogContent =
      localStorage.getItem('blogContent');

    if (blogContent) {

      const data = JSON.parse(blogContent);

      this.blogContent = data[0];

    } else {

      const param = {
        user_id:
          GlobalConstants.MASTER_SETTING_USER_ID,

        page_url: 'blog',
      };

      this.pagesService
        .PageContent(param)
        .subscribe((res) => {

          localStorage.setItem(
            'blogContent',
            JSON.stringify(res.data)
          );

          this.blogContent = res.data[0];

        });

    }
  }


  loadBlogs(
    slug: any,
    tag_slug: any,
    author_slug: any
  ) {

    this.spinner.show();

    const formData = new FormData();

    formData.append(
      'cat_slug',
      slug || ''
    );

    formData.append(
      'tag_slug',
      tag_slug || ''
    );

    formData.append(
      'author_slug',
      author_slug || ''
    );

    this.http
      .post(
        this.apiURL + '/bloglist',
        formData
      )
      .subscribe(

        (res: any) => {

          this.blogData = res.data.blogs;

          this.categoryData =
            res.data.categories;

          this.spinner.hide();

        },

        (error) => {

          console.error(
            'API Error:',
            error
          );

          this.spinner.hide();

        }

      );
  }


  getList(url: string) {

    this.spinner.show();

    const formData = new FormData();

    formData.append(
      'cat_slug',
      this.slug || ''
    );

    formData.append(
      'tag_slug',
      this.tag_slug || ''
    );

    formData.append(
      'author_slug',
      this.author_slug || ''
    );


    const page =
      new URL(url).searchParams.get('page');

    if (page === '1') {

      // Remove ?page=1
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {},
        replaceUrl: true
      });

    }

    else if (page) {

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          page: page
        },
        queryParamsHandling: ''
      });

    }

    this.http
      .post(url, formData)
      .subscribe(

        (res: any) => {

          this.blogData =
            res.data.blogs;

          this.categoryData =
            res.data.categories;

          this.spinner.hide();

        },

        (error) => {

          console.error(
            'API Error:',
            error
          );

          this.spinner.hide();

        }

      );
  }


  changePage(page: number): void {

    console.log('Selected page:', page);

    if (page === 1) {

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {},
        replaceUrl: true
      });

      // Load default blog
      this.loadBlogs(
        this.slug,
        this.tag_slug,
        this.author_slug
      );

      return;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: page
      },
      queryParamsHandling: ''
    });

  }

}
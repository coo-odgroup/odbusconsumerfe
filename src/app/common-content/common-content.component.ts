import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalConstants } from '../constants/global-constants';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface FaqItem {
  question: string;
  answer: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-common-content',
  templateUrl: './common-content.component.html',
  styleUrls: ['./common-content.component.css'],
})
export class CommonContentComponent implements OnInit {
  faqs: FaqItem[] = [];
  slug: string = '';
  pageDetails: any;

  private apiURL = GlobalConstants.BASE_URL;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.slug = params['slug'];

      // console.log(this.slug);

      this.getPageDetails();
    });
  }

  getPageDetails() {
    const postData = {
      page_url: this.slug,
    };

    this.http
      .post(this.apiURL + '/get-advantage-details', postData)
      .subscribe((response: any) => {
        this.pageDetails = response.page;
        // this.faqs = response.faqs;

        this.faqs = response.faqs.map((item: any, index: number) => ({
          question: item.title,
          answer: item.content,
          isOpen: index === 0
        }));

        // console.log(this.pageDetails);
        // console.log(this.faqs);
      });
  }

  toggleFaq(index: number): void {
    this.faqs.forEach((faq, i) => {
      faq.isOpen = i === index ? !faq.isOpen : false;
    });
  }
}

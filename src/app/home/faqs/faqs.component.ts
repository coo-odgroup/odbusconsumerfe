import { Component, OnInit } from '@angular/core';
import { GlobalConstants } from '../../constants/global-constants';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.css', '../home.component.css']
})
export class FaqsComponent implements OnInit {

  private apiurl = GlobalConstants.BASE_URL;
  faqs: any[] = [];
  activeTab: number = 0;
  openIndex: number[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchFaqs();
  }

  private fetchFaqs(): void {
    const payload = {};

    this.http.post(this.apiurl + '/getfaqs', payload).subscribe((res: any) => {
      this.faqs = res.data;
      this.openIndex = this.faqs.map(() => 0);
    });
  }

}

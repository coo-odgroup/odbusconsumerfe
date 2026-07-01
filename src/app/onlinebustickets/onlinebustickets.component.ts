import { Component, OnInit } from '@angular/core';
import { GlobalConstants } from '../constants/global-constants';
import { NgxSpinnerService } from 'ngx-spinner';
import { PagesService } from '../services/pages.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-onlinebustickets',
  templateUrl: './onlinebustickets.component.html',
  styleUrls: ['./onlinebustickets.component.css'],
})
export class OnlinebusticketsComponent implements OnInit {
  pageTitle: any;
  pageContent: any;

  isMobile: boolean;

  constructor(
    private spinner: NgxSpinnerService,
    private pagesService: PagesService,
    private detectService: DeviceDetectorService,
  ) {
    this.isMobile = this.detectService.isMobile();
  }

  ngOnInit(): void {
    this.spinner.show();

    const onlineBusTicketsContent = localStorage.getItem('onlineBusTicketsContent');

    if (onlineBusTicketsContent) {
      const data = JSON.parse(onlineBusTicketsContent);
      this.onlineBusTicketsContent(data);
    } else {
      const param = {
        user_id: GlobalConstants.MASTER_SETTING_USER_ID,
        page_url: 'online-bus-tickets',
      };

      this.pagesService.PageContent(param).subscribe((res) => {
        localStorage.setItem('onlineBusTicketsContent', JSON.stringify(res.data));
        this.onlineBusTicketsContent(res.data);
      });
    }

    this.spinner.hide();
  }

  onlineBusTicketsContent(res: any) {
    if (res.length > 0) {
      this.pageTitle = res[0].page_name;
      this.pageContent = res[0].page_description;
    }
  }
}

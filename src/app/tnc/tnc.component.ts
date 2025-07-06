import { Component, OnInit } from '@angular/core';
import {PagesService} from '../services/pages.service';
import { GlobalConstants } from '../constants/global-constants';

import { SeoService } from '../services/seo.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-tnc',
  templateUrl: './tnc.component.html',
  styleUrls: ['./tnc.component.css']
})
export class TncComponent implements OnInit {

  pageTitle:any;
  pageContent:any;
  currentUrl: any;
  constructor( private pagesService: PagesService,private seo:SeoService,
    private location: Location) { 

    this.currentUrl = location.path().replace('/','');
        this.seo.seolist(this.currentUrl);
        
  }

  ngOnInit(): void {
    const data={
      user_id:GlobalConstants.MASTER_SETTING_USER_ID,
      page_url:'terms-conditions'
    };
    this.pagesService.PageContent(data).subscribe(
      res=>{
        if(res.data.length>0){
        this.pageTitle=res.data[0].page_name;
        this.pageContent=res.data[0].page_description;
        }
      }
    );
  }

}

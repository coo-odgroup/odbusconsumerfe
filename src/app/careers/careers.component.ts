import { Component, OnInit } from '@angular/core';


import { SeoService } from '../services/seo.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-careers',
  templateUrl: './careers.component.html',
  styleUrls: ['./careers.component.css']
})
export class CareersComponent implements OnInit {

  currentUrl: any;


  constructor(private seo:SeoService,
    private location: Location) { 

      this.currentUrl = location.path().replace('/','');
      this.seo.seolist(this.currentUrl);
      
    }

  ngOnInit(): void {
  }

}

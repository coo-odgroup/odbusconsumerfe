import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-userhelpsupport',
  templateUrl: './userhelpsupport.component.html',
  styleUrls: ['./userhelpsupport.component.css']
})
export class UserhelpsupportComponent implements OnInit {

  isMobile: boolean;
    constructor(private deviceService: DeviceDetectorService) {
      this.isMobile = this.deviceService.isMobile();
    }
  
    ngOnInit(): void {
    }

}

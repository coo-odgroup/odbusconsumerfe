import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-userrewards',
  templateUrl: './userrewards.component.html',
  styleUrls: ['./userrewards.component.css']
})
export class UserrewardsComponent implements OnInit {

  isMobile: boolean;
  constructor(private deviceService: DeviceDetectorService) {
    this.isMobile = this.deviceService.isMobile();
  }

  ngOnInit(): void {
  }

}

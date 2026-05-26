import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-usernotifications',
  templateUrl: './usernotifications.component.html',
  styleUrls: ['./usernotifications.component.css']
})
export class UsernotificationsComponent implements OnInit {

  isMobile: boolean
  constructor(private deviceService: DeviceDetectorService,) {
    this.isMobile = this.deviceService.isMobile();
   }

  ngOnInit(): void {
  }

}

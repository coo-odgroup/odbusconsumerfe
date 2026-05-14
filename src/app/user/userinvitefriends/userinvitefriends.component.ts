import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-userinvitefriends',
  templateUrl: './userinvitefriends.component.html',
  styleUrls: ['./userinvitefriends.component.css']
})
export class UserinvitefriendsComponent implements OnInit {

  isMobile: boolean;
  constructor(private deviceService: DeviceDetectorService) {
    this.isMobile = this.deviceService.isMobile();
  }

  ngOnInit(): void {
  }

}

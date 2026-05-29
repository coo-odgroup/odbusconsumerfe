import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-download-app',
  templateUrl: './download-app.component.html',
  styleUrls: ['./download-app.component.css', '../home.component.css'],
})
export class DownloadAppComponent implements OnInit {
  isMobile: boolean = false;

  constructor(
    private deviceService: DeviceDetectorService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.isMobile = isPlatformBrowser(this.platformId)
      ? this.deviceService.isMobile()
      : false;
  }

  ngOnInit(): void {}
}

import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Router } from '@angular/router';



@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent implements OnInit {

  name:any;
  phone:any;
  email:any;
  isMobile: boolean;
  MenuActive: boolean = false;
  receipt_id:any;


      
  constructor(private deviceService: DeviceDetectorService,private router: Router) {

    this.isMobile = this.deviceService.isMobile(); 

   
   

   }

  ngOnInit(): void {

    this.name=localStorage.getItem('od_success_name');

    if(this.name==null){     
      this.router.navigate(['/']);
    }
    this.phone=localStorage.getItem('od_success_phone');
    this.email=localStorage.getItem('od_success_email');
    this.receipt_id= localStorage.getItem('receipt_id');


  }

}

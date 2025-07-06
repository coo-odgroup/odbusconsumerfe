import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ManagebookingService } from '../services/managebooking.service';
import { NotificationService } from '../services/notification.service';
import { NgxSpinnerService } from "ngx-spinner";


import { SeoService } from '../services/seo.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-managebookingdetails',
  templateUrl: './managebookingdetails.component.html',
  styleUrls: ['./managebookingdetails.component.css']
})
export class ManagebookingdetailsComponent implements OnInit {

  tab1:boolean=true;
  tab2:boolean=false;
  tab3:boolean=false;

  bookingDetails:any;

  seats:any=[];
  totalseats:any=[];
  cancelInfo:any=[];
  currentUrl: string;

  constructor(public router: Router,private notify: NotificationService,
    private managebookingService: ManagebookingService,
    private spinner: NgxSpinnerService ,private seo:SeoService,
    private location: Location) { 

    this.currentUrl = location.path().replace('/','');
        this.seo.seolist(this.currentUrl); 

    this.bookingDetails= JSON.parse(localStorage.getItem("bookingDetails"));

    if(this.bookingDetails == null){

      this.router.navigate(['manage-booking']);

    }


    for(let i=0;i< this.bookingDetails.booking[0].booking_detail.length ;i++){
      this.seats.push(this.bookingDetails.booking[0].booking_detail[i].bus_seats.seats.seatText);
    }


    this.totalseats  = this.seats.length;
   
   

  }

  print_ticketTab() {  
    
    this.tab1=true;
    this.tab2=false;
    this.tab3=false;
  }

  sms_email_ticketTab() {   

    this.tab1=false;
    this.tab2=true;
    this.tab3=false;
  }

  cancelTicketTab() {   

    this.spinner.show();


    const request= {
      "pnr":this.bookingDetails.booking[0].pnr,
      "mobile":this.bookingDetails.phone
     };

    this.managebookingService.getcancelTicketInfo(request).subscribe(
      res=>{        
        //console.log(res);

        if(res.status==1){

          this.cancelInfo=res.data;
              this.tab1=false;
              this.tab2=false;
              this.tab3=true;                      
        }
        if(res.status==0){
          this.notify.notify(res.message,"Error");
        }
        this.spinner.hide();
      },
    error => {
      this.spinner.hide();
      this.notify.notify(error.error.message,"Error");
    }
    );



    
  }

  cancel_ticket(){

    if(confirm("Are you sure cancel the ticket ? ")) {
      
   
    this.spinner.show();
    const request= {
      "pnr":this.bookingDetails.booking[0].pnr,
      "phone":this.bookingDetails.phone
     };

     
    this.managebookingService.cancelTicket(request).subscribe(
      res=>{ 
        
        if(res.status==1){    
          this.cancelInfo.cancel_status  =false;    
          this.notify.notify(res.message,"Success");                
        } 
        if(res.status==0){
          this.notify.notify(res.message,"Error");           
        } 

        this.spinner.hide();

      },
    error => {
      this.spinner.hide();
      this.notify.notify(error.error.message,"Error");
    }
    );

  }


  }

  send_email_sms(){

    this.spinner.show();

    const request= {
      "pnr":this.bookingDetails.booking[0].pnr,
      "mobile":this.bookingDetails.phone
     };

    this.managebookingService.sendEmailSms(request).subscribe(
      res=>{ 
        if(res.status==1){
          this.notify.notify(res.data,"Success");           
        } 
        
        if(res.status==0){
          this.notify.notify(res.message,"Error");           
        } 
        
        this.spinner.hide();      
      },
    error => {
      this.spinner.hide();
      this.notify.notify(error.error.message,"Error");
    }
    );


  }

  print(): void {

    var printButton = document.getElementById('print_btn');
    printButton.style.visibility = 'hidden';

    // var print_logo = document.getElementById('print_logo');
    // print_logo.style.visibility = 'visible';

    // console.log(print_logo);

    const printContents = document.getElementById('print-section').innerHTML;
    const popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
   
    popupWin.document.write(`
        <html>
            <head>
                <title>Print Page</title>
            </head>
            <body
                style="font-size: 14px;
                    font-family: 'Source Sans Pro', 'Helvetica Neue',
                    Helvetica, Arial, sans-serif;
                    color: #333";
                onload="document.execCommand('print');window.close()">${printContents}</body>
        </html>`
    );
   printButton.style.visibility = 'visible';
    popupWin.document.close();
  }  

  ngOnInit(): void {
   
  }

}

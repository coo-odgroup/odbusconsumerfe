import { Component, OnInit } from '@angular/core';
import { ManagebookingService } from '../services/managebooking.service';
import { NotificationService } from '../services/notification.service';
import { NgxSpinnerService } from "ngx-spinner";
import { DatePipe, Location } from '@angular/common';
import { Router,ActivatedRoute } from '@angular/router';
import { GlobalConstants } from '../constants/global-constants';



@Component({
  selector: 'app-pnrdetail',
  templateUrl: './pnrdetail.component.html',
  styleUrls: ['./pnrdetail.component.css']
})
export class PnrdetailComponent implements OnInit {

  qrCode:any='';

  bookingDetails:any;
  seats:any=[];
  totalseats:any=[];
  brdtime:any;
  drptime:any;

  constructor(
    public router: Router,
    private notify: NotificationService,
    private managebookingService: ManagebookingService,
    private spinner: NgxSpinnerService ,
    private location: Location,
    private route: ActivatedRoute
    ) {
     
       let pnr=this.route.snapshot.paramMap.get('id');

       this.spinner.show();

       this.managebookingService.pnrDetail(pnr).subscribe(
        (res) => {   
          
          // console.log(res);

          if(res.status==1){
            this.bookingDetails= res.data[0];

            console.log(this.bookingDetails);

            let brdtmarr = this.bookingDetails.booking[0].boarding_time.split(':');
            this.brdtime = brdtmarr[0]+':'+brdtmarr[1];  
            
            let drptmarr = this.bookingDetails.booking[0].dropping_time.split(':');
            this.drptime = drptmarr[0]+':'+drptmarr[1];  

            for(let i=0;i< this.bookingDetails.booking[0].booking_detail.length ;i++){
              this.seats.push(this.bookingDetails.booking[0].booking_detail[i].bus_seats.seats.seatText);
            }

          this.totalseats  = this.seats.length;

          this.qrCode =GlobalConstants.URL+"pnr/"+this.bookingDetails.booking[0].pnr;

           
          } 
          
          if(res.status==0){
            this.router.navigate(['/']);           
          } 
          
          this.spinner.hide();    
        },
        (error) => {
          this.spinner.hide();
          //this.notify.notify(error.error.message, 'Error');
        }
      );

         
  }


  print(): void {

    var printButton = document.getElementById('print_btn');
    printButton.style.visibility = 'hidden';

    const printContents = document.getElementById('print-section').innerHTML;
    const popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
   
    popupWin.document.write(` <html>
            <head>
                <title>Print Page</title>
            </head>
            <body
                style="font-size: 14px;
                    font-family: 'Source Sans Pro', 'Helvetica Neue',
                    Helvetica, Arial, sans-serif;
                    color: #333;border: solid 1px #000; padding:5px;";
                onload="document.execCommand('print');window.close()">${printContents}</body>
        </html>`
    );
   printButton.style.visibility = 'visible';
    popupWin.document.close();
  }  

  ngOnInit(): void {
   
  }

}

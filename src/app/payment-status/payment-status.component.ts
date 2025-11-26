import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MakepaymentService } from '../services/makepayment.service';

@Component({
  selector: 'app-payment-status',
  templateUrl: './payment-status.component.html',
  styleUrls: ['./payment-status.component.css']
})
export class PaymentStatusComponent implements OnInit {

  constructor(private spinner:NgxSpinnerService,private makepaymentService:MakepaymentService) { }


  // checkPayment(){

  //   const payload = {
  //     transaction_id :this.bookTicketResponse.transaction_id,
  //     pp_orderId : this.pp_orderId
  //   }
  //   this.spinner.show();

  //   this.makepaymentService.paymentStatus(payload).subscribe((res:any)=>{
  //     console.log(res)
  //   });

  // }

  ngOnInit(): void {
    const transaction_id = localStorage.getItem('transaction_id')
    const pp_orderId = localStorage.getItem('pp_orderId')


    const payload = {
      transaction_id :transaction_id,
      pp_orderId : pp_orderId
    }
    this.spinner.show();

    this.makepaymentService.paymentStatus(payload).subscribe((res:any)=>{
      console.log(res.data)

      if(res.data == "Payment Done"){
        window.location.href="/success";
        localStorage.removeItem('transaction_id')
        localStorage.getItem('pp_orderId')
      }else if(res.data == "Payment Failed"){
        alert("Payment Failed");
        window.location.href="/";
      }
    });



    // console.log(pp_orderId,transaction_id);
  }

}

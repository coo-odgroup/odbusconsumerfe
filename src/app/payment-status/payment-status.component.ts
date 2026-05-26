import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MakepaymentService } from '../services/makepayment.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-payment-status',
  templateUrl: './payment-status.component.html',
  styleUrls: ['./payment-status.component.css']
})
export class PaymentStatusComponent implements OnInit {

  constructor(private spinner: NgxSpinnerService, private makepaymentService: MakepaymentService) { }


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

    // if(pp_orderId != null){
    //   window.location.href="/success";
    //   localStorage.removeItem('transaction_id')
    //   localStorage.getItem('pp_orderId')
    // }else{
    //   alert("Payment Failed");
    //     window.location.href="/";
    // }


    const payload = {
      pp_orderId: pp_orderId
    }
    this.spinner.show();

    this.makepaymentService.paymentStatus(payload).subscribe((res: any) => {
      console.log(res.data.phonepe_status)

      if (res.data.phonepe_status == "COMPLETED") {
        window.location.href = "/success";
        localStorage.removeItem('transaction_id')
        localStorage.getItem('pp_orderId')
      } else if (res.data.phonepe_status == "FAILED") {
        this.spinner.hide();
        Swal.fire({
          icon: 'error',
          title: 'Payment Failed',
          text: 'Your payment was not successful. Please try again.',
          confirmButtonText: 'Go Home',
          allowOutsideClick: false,
          confirmButtonColor: '#d33'
        }).then(() => {
          window.location.href = "/";
        });
      } else {
        this.spinner.hide();
        Swal.fire({
          icon: 'error',
          title: 'Payment Failed',
          text: 'Your payment was not successful. Please try again.',
          confirmButtonText: 'Go Home',
          allowOutsideClick: false,
          confirmButtonColor: '#d33'
        }).then(() => {
          window.location.href = "/";
        });
      }
    });



    // console.log(pp_orderId,transaction_id);
  }

}

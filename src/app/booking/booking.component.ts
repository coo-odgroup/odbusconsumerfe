import { Component, OnInit, ChangeDetectorRef, Input, SecurityContext, EventEmitter } from '@angular/core';
import { NgWizardConfig, NgWizardService, StepChangedArgs, StepValidationArgs, STEP_STATE, THEME } from 'ng-wizard';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExternalLibraryService } from '../util';
import { BookticketService } from '../services/bookticket.service';
import { MakepaymentService } from '../services/makepayment.service';
import { PaymentstatusService } from '../services/paymentstatus.service';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificationService } from '../services/notification.service';
import { TokenService } from '../shared/token.service';
import { GenderCheck } from '../helpers/gender-check';
import { DatePipe } from '@angular/common';
import { LoginChecker } from '../helpers/loginChecker';
import { GlobalConstants } from '../constants/global-constants';
import { CouponService} from '../services/coupon.service';
import { Coupon } from '../model/coupon';
import * as moment from 'moment';
import { DeviceDetectorService } from 'ngx-device-detector';
import { SeoService } from '../services/seo.service';
import { Location } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonService } from '../services/common.service';
import {PlatformLocation } from '@angular/common';
import { EquirectangularReflectionMapping } from 'three';
import { ManagebookingService } from '../services/managebooking.service';
import {load} from '@cashfreepayments/cashfree-js';

declare let Razorpay: any;

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css'],
  providers: [DatePipe]
})

export class BookingComponent implements OnInit{ 

  stepStates = {
    normal: STEP_STATE.normal,
    disabled: STEP_STATE.disabled,
    error: STEP_STATE.error,
    hidden: STEP_STATE.hidden
  };
 
  config: NgWizardConfig = {
    selected: 0,
    theme: THEME.arrows,
    toolbarSettings: {
      toolbarExtraButtons: [
        { text: 'Finish', class: 'btn btn-info', event: () => { alert("Finished!!!"); } }
      ],
    }
  };

  genderArr:any=[];
  couponData :  Coupon;

  currentUrl: any;
  bookingStep2:boolean=false;
  bookingStep3:boolean=false;
  app_type="WEB";

  MenuActive:boolean=false;
  qrCode:any='';
  autoApplyCouponStatus:boolean=false;

  public gstStatus:boolean=false;
  public gstdeduction:any=0;

  @Input() session: LoginChecker;  

   Timer= 600;
   public bookForm1: FormGroup;
   public bookForm2: FormGroup;
   public bookForm3: FormGroup;
   public couponForm: FormGroup;

   submitted1=false;
   submitted2=false;
   couponSubmitted=false;

   bookingdata: any;
   busRecord: any;
   genderRestrictSeats: any;
   bookingDate:any;
   passengerData: any=[];

   bookTicketResponse :any=[];
   MakePaymnetResponse :any=[];

   source:any;
   destination:any;
   source_id:any;
   destination_id:any;
   entdate:any;
   formatentdate:any;

   razorpayResponse: any;
   response: any;
   tabclick :any = true;

   customerInfoname:any=null;
   customerInfoEmail:any=null;
   customerInfoPhone:any=null;

   isnameReadOnly:boolean=false;
   isphoneReadOnly:boolean=false;
   ismailReadOnly:boolean=false;
   isMobile:boolean;


   total_seat_name:any=[];
   seat_ids:any=[];
   lb_seats:any=[];
   ub_seats:any=[];
   loadingText: string = 'Loading...';

   created_by:any='Customer';

   agent:any;
   applied_comission:number=0;
   autoApplyCouponcode:any='';

   masterSettingRecord:any=[];
   
  activeMenu: string;
  constructor(private ngWizardService: NgWizardService,private fb : FormBuilder,
    private router: Router,private bookticketService:BookticketService,
    private razorpayService: ExternalLibraryService,
    private cd:  ChangeDetectorRef,
    private notify: NotificationService,
    private makepaymentService:MakepaymentService,
    private paymentstatusService: PaymentstatusService,
    private spinner: NgxSpinnerService,    
    private token: TokenService,
    private commonService: CommonService,
    private datePipe: DatePipe,
    private couponService:CouponService,
    private deviceService: DeviceDetectorService,
    private seo:SeoService,
      private location: Location,
      private sanitizer: DomSanitizer,
      private platformLocation: PlatformLocation,
    private managebookingService: ManagebookingService
    ) { 
      this.razorpayService
    .lazyLoadLibrary('https://checkout.razorpay.com/v1/checkout.js')
    .subscribe();
    

      this.isMobile = this.deviceService.isMobile();

      if(this.isMobile){
        this.app_type='MOB';
      }

      this.currentUrl = location.path().replace('/','');
      this.seo.seolist(this.currentUrl);


      this.session = new LoginChecker();

      if(this.session.isLoggedIn()){
        this.user = this.session.getUser();
        this.customerInfoname=this.user.name;
        this.customerInfoEmail=this.user.email;
        this.customerInfoPhone=this.user.phone;  
      }
     
     
    this.source=localStorage.getItem('source');
    this.destination=localStorage.getItem('destination');   
    const entdt:any =localStorage.getItem('entdate'); 

    this.entdate = this.showformattedDate(entdt);

    this.source_id=localStorage.getItem('source_id');
    this.destination_id=localStorage.getItem('destination_id');


    this.genderArr=[
      {
        'name' : 'Male',
        'value' : 'M'
      },
      {
        'name' : 'Female',
        'value' : 'F'
      }
    ];

    this.bookingdata=localStorage.getItem('bookingdata');
    this.busRecord=localStorage.getItem('busRecord');
    this.genderRestrictSeats=localStorage.getItem('genderRestrictSeats');

    
   // console.log(this.busRecord);

    if(this.bookingdata == null && this.busRecord == null){
      this.router.navigate(['/']);
    }else{
      this.bookingdata= JSON.parse(this.bookingdata);
      this.busRecord= JSON.parse(this.busRecord);      
      if(this.busRecord.couponDetails!= null && this.busRecord.couponDetails.length==1){
        this.autoApplyCouponcode=this.busRecord.couponDetails[0].coupon_code;
      }

      if(this.busRecord.origin=='MANTIS'){
        this.gstStatus=true;
      }
      this.genderRestrictSeats= JSON.parse(this.genderRestrictSeats);

      //console.log(this.genderRestrictSeats);

     // console.log(this.bookingdata.boardingPoint);

      let brdTm_arr = this.bookingdata.boardingPoint.boardTime.split(" | ");
      let drpTm_arr = this.bookingdata.droppingPoint.dropTime.split(" | ");

      // this.bookingdata.boardingPoint=brdTm_arr[0];
      // this.bookingdata.droppingPoint=drpTm_arr[0];
      // this.busRecord.departureTime=brdTm_arr[1];
      // this.busRecord.arrivalTime=drpTm_arr[1]; 

      // if(this.bookingdata.UpperBerthSeats.length){
      //   this.total_seat_name =this.total_seat_name.concat(this.bookingdata.UpperBerthSeats);
      //   this.ub_seats = this.ub_seats.concat(this.bookingdata.UpperBerthSeats);

      // } 

      // if(this.bookingdata.LowerBerthSeats.length){
      //   this.total_seat_name =this.total_seat_name.concat(this.bookingdata.LowerBerthSeats);
      //   this.lb_seats = this.lb_seats.concat(this.bookingdata.LowerBerthSeats);
      // }
      
      

      
      
    }

    this.bookForm2 = this.fb.group({
      tnc:[true, Validators.requiredTrue],
      customer_gst_status:[(this.busRecord.origin=='MANTIS') ? true : false],
      customer_gst_number:[null],
      customer_gst_business_name:[null],
      customer_gst_business_email:[null,[Validators.email]],
      customer_gst_business_address:[null],
      userInput:[null],
    });


    this.couponData={  
      "totalAmount": this.bookingdata.PriceArray.totalFare,    
      "discount": 0,
      "payableAmount" :this.bookingdata.PriceArray.totalFare
    } as Coupon;

  
    this.bookForm3 = this.fb.group({});

        this.bookForm1 = this.fb.group({
          customerInfo: this.fb.group({          
            email: [this.customerInfoEmail, [Validators.required,Validators.email]],
            phone: [this.customerInfoPhone, [Validators.required,Validators.pattern("^[0-9]{10}$")]],  
            name:[this.customerInfoname, [Validators.required, Validators.pattern('^[a-zA-Z \-\']+')]],
          }),            
          
          bookingInfo: this.fb.group({
            coupon_code:this.autoApplyCouponcode, 
            user_id:GlobalConstants.USER_ID,
            bus_id: [this.busRecord.busId],
            source_id: [this.source_id],
            destination_id: [this.destination_id],
            journey_date: [this.entdate],
            boarding_point: [this.bookingdata.boardingPoint.boardTime],
            dropping_point: [this.bookingdata.droppingPoint.dropTime],
            boarding_time: [this.busRecord.departureTime],
            dropping_time: [this.busRecord.arrivalTime],
            app_type: [this.app_type],
            typ_id: ["1"],
            // total_fare: this.bookingdata.PriceArray.totalFare,
            // specialFare: this.bookingdata.PriceArray.specialFare,
            // addOwnerFare:this.bookingdata.PriceArray.addOwnerFare,
            // festiveFare:this.bookingdata.PriceArray.festiveFare,
            // owner_fare: this.bookingdata.PriceArray.ownerFare,
            // odbus_service_Charges: this.bookingdata.PriceArray.odbusServiceCharges,
            // transactionFee: this.bookingdata.PriceArray.transactionFee,
            created_by: this.created_by,
            CompanyID: this.busRecord.CompanyID,
            PickupID: this.bookingdata.boardingPoint.id,
            DropID: this.bookingdata.droppingPoint.id,
            origin: this.busRecord.origin,
            ReferenceNumber: this.busRecord.ReferenceNumber,
            RouteTimeID: this.busRecord.RouteTimeID,
            bookingDetail: this.fb.array([]),        
          })
        });
  
    


    const bookingInfo = this.bookForm1.controls["bookingInfo"] as FormGroup;
    const passengerList = bookingInfo.get('bookingDetail') as FormArray;

    if(this.bookingdata.Upperberth.length){
      this.bookingdata.Upperberth.forEach(u => {
       let uar= u.split('-');
       this.seat_ids.push(uar[0]);
       this.total_seat_name.push(uar[1]);

       passengerList.push(this.createItem(uar[0],this.busRecord.sleeperPrice)); 
        
      });
      //this.seat_ids =this.seat_ids.concat();
     
    }

    if(this.bookingdata.Lowerberth.length){

      this.bookingdata.Lowerberth.forEach(u => {
        let lar= u.split('-');
        this.seat_ids.push(lar[0]);
        this.total_seat_name.push(lar[1]);

        passengerList.push(this.createItem(lar[0],this.busRecord.seaterPrice)); 
         
       });

      //this.seat_ids =this.seat_ids.concat(this.bookingdata.Lowerberth);
    }


    //console.log(this.seat_ids);
    
      // for(let i=0;i< this.bookingdata.Upperberth.length ;i++){
      //   let seat= this.bookingdata.Upperberth[i];
         
      // }

      // for(let i=0;i< this.bookingdata.Lowerberth.length ;i++){
      //   let seat= this.bookingdata.Lowerberth[i];
      //    passengerList.push(this.createItem(seat,this.busRecord.seaterPrice)); 
      // }  


      this.couponForm = this.fb.group({
        coupon_code:[null, Validators.required]
      });
  
  }


  menu(){
    this.MenuActive = (this.MenuActive==false) ? true : false;
    
    this.activeMenu='';  
  }

  public tncStatus:boolean=true;

  public tncStatusChange(value:boolean){
      this.tncStatus = value;
  }


  public customer_gst_StatusChange(value:boolean){

    this.gstStatus = value;

  }


  

  onlyNumbers(event:any) {
    var e = event ;
    var charCode = e.which || e.keyCode;
   
      if ((charCode >= 48 && charCode <= 57) || (charCode >= 96 && charCode <= 105) || charCode ==8 || charCode==9)
        return true;
        return false;        
}

get_seatno(seat_id:any){
  for(let i=0;i< this.bookingdata.Lowerberth.length ;i++){    
    let seat_ar= this.bookingdata.Lowerberth[i].split('-');    
    let seat= seat_ar[0];
     if(seat==seat_id){
      return seat_ar[1];
      //return this.bookingdata.LowerBerthSeats[i]
     }
  }  

  for(let i=0;i< this.bookingdata.Upperberth.length ;i++){
    let seat_ar= this.bookingdata.Upperberth[i].split('-');
    let seat= seat_ar[0];
    if(seat==seat_id){
      return seat_ar[1];
     // return this.bookingdata.UpperBerthSeats[i]
     }
  }
}

  showformattedDate(date:any){
    if(date){

      let dt = date.split("-");
    return dt[2]+'-'+dt[1]+'-'+dt[0];

    }
    

  }

   createItem(seat:any,fare:any): FormGroup{

   // console.log(this.genderRestrictSeats);

   // Validators.pattern("^[1-9]*$"),

    return this.fb.group({
      bus_seats_id: [seat], 
      passenger_name: [null, [Validators.required, Validators.pattern('^[a-zA-Z \-\']+')]],
      passenger_gender: [null, Validators.required],
      passenger_age:  [null, [Validators.required,
      Validators.min(1),Validators.max(100)]],
      created_by: this.created_by
    },
    {
      validator: GenderCheck('passenger_gender','bus_seats_id', this.genderRestrictSeats)
    });
  }

  get passengerFormGroup() {
    const bookingInfo = this.bookForm1.controls["bookingInfo"] as FormGroup;
    const passengerList = bookingInfo.get('bookingDetail') as FormArray;    
    return passengerList;
  }

  getPassengerFormGroup(index:any): FormGroup {
    const bookingInfo = this.bookForm1.controls["bookingInfo"] as FormGroup;
    const passengerList = bookingInfo.get('bookingDetail') as FormArray;
    const formGroup = passengerList.controls[index] as FormGroup;
    return formGroup;
  }

  get f() {     
    return this.bookForm1.controls;
   }

   get GetcustomerInfo():FormGroup{

    const FormGroup = this.bookForm1.get('customerInfo') as FormGroup;
    //const FormControl = ele.controls[type] as FormControl;
   // console.log(FormGroup);
    return FormGroup;

   }

   ApplyCoupon(){

    this.couponSubmitted=true;

    if (this.couponForm.invalid) {
      return;
    }else{
     this.spinner.show();   

    const params= {
      "coupon_code":this.couponForm.value.coupon_code,  
      "bus_id":this.busRecord.busId,  
      "source_id":this.source_id, 
      "destination_id":this.destination_id,
      "journey_date":this.entdate,
      "bus_operator_id":this.busRecord.operatorId,
      "transaction_id" :this.bookTicketResponse.transaction_id
    };

     this.couponService.apply(params).subscribe(
      res=>{
        this.spinner.hide();          
        if(res.status==1){ 
         
          this.autoApplyCouponcode=this.couponForm.value.coupon_code;
          this.couponData=res.data;

          //if(this.gstStatus==true){

           // this.gstdeduction= ((this.bookingdata.PriceArray.odbus_charges_ownerFare - this.couponData.discount) * this.customer_gst)/100;

           // this.gstdeduction = Math.round(this.gstdeduction * 100) / 100;
            
           // this.couponData.payableAmount +=this.gstdeduction;
    
          //  this.couponData.payableAmount = Math.round(this.couponData.payableAmount * 100) / 100;

         // }
          
          
        }else{
          this.notify.notify(res.message,"Error");
        }    
    },
    error => {

      this.spinner.hide();
      this.notify.notify(error.error.message,"Error");
     
    }
    );


    }

   }


  
  submitForm1(){
    this.submitted1=true;

    if (this.bookForm1.invalid) {
      return;
     }else{
      this.spinner.show();
      this.passengerData=this.bookForm1.value; 

    //   console.log(this.passengerData);
    //  return;

        this.bookticketService.book(this.passengerData).subscribe(
          res=>{ 
          if(res.status==1){  

            if(res.data.totalAmount && res.data.discount && res.data.payableAmount){

              this.autoApplyCouponStatus=true;
              this.couponData={  
                "totalAmount": res.data.totalAmount,    
                "discount": res.data.discount,
                "payableAmount" :res.data.payableAmount
              } as Coupon;
            }

            this.bookTicketResponse=res.data;

            if(this.isMobile==true){

              this.bookingStep2=true;

            }else{
              this.showNextStep();
            }
            
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


  countdown:any;

  submitForm2(){

    this.submitted2=true;
    if (this.bookForm2.invalid) {
      return;
     }else{
     
      let pass_det=this.bookForm1.value.bookingInfo.bookingDetail;

      let gender:any=[];
      pass_det.forEach((e: any) => {
        gender.push(e.passenger_gender);
        
      });

      const entdt:any =localStorage.getItem('entdate'); 

      if(this.gstStatus==true){

        if(this.bookForm2.value.customer_gst_number=='' || this.bookForm2.value.customer_gst_number==null){

          this.notify.notify("GST No is required","Error");
          return;

        }

       let g= this.bookForm2.value.customer_gst_number;

       if(g != ''){

        let a=65,b=55,c=36;
        const isValidFormat = (new RegExp('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}[Z]{1}[A-Z0-9]{1}$')).test(g);
        const isValidGSTIN = Array.from(g).reduce((i:any,j:any,k:any,g:any)=>{
          var p= (p= (j.charCodeAt(0) < a ? parseInt(j) : j.charCodeAt(0) - b) * (k % 2 + 1) ) > c ? 1+(p-c) : p;
          return k<14 ? i+p : j == ((c=(c-(i%c))) < 10 ? c : String.fromCharCode(c+b));
        },0);
        // console.log(`format:${isValidFormat}, num:${isValidGSTIN}`);

        if(!isValidFormat){
          this.notify.notify("Invalid GSTIN Format","Error");
          return;

        }else if(!isValidGSTIN){
          this.notify.notify("Invalid GSTIN","Error");
          return;
        }

        if(this.bookForm2.value.customer_gst_business_name=='' || this.bookForm2.value.customer_gst_business_name==null){

          this.notify.notify("Business Name is required","Error");
          return;

        }

        if(this.bookForm2.value.customer_gst_business_email=='' || this.bookForm2.value.customer_gst_business_email==null){

          this.notify.notify("Business Email is required","Error");
          return;

        }

        if(this.bookForm2.value.customer_gst_business_address=='' || this.bookForm2.value.customer_gst_business_address==null){

          this.notify.notify("Business Address is required","Error");
          return;

        }        

      }
    }


      if(this.captchaValidated==false){
        this.notify.notify("Captch is not validated","Error");
          return;
      }

      this.spinner.show();
      ///// call to make payment API to get RazorPayment Order ID and Total price   

        const paymentParam={        
          "busId" : this.busRecord.busId,
          "sourceId":this.source_id, 
          "destinationId":this.destination_id,
          "transaction_id": this.bookTicketResponse.transaction_id,
          "seatIds":this.seat_ids,
          "entry_date":entdt,
          "customer_gst_status":true,//this.bookForm2.value.customer_gst_status,
          "customer_gst_number":this.bookForm2.value.customer_gst_number,
          "customer_gst_business_name":this.bookForm2.value.customer_gst_business_name,
          "customer_gst_business_email":this.bookForm2.value.customer_gst_business_email,
          "customer_gst_business_address":this.bookForm2.value.customer_gst_business_address
        }

       // console.log(JSON.stringify(paymentParam));
        //return;

        this.makepaymentService.getOrderid(paymentParam).subscribe(
          res=>{
                    
            if(res.status==1){
              if(res.data=='SEAT UN-AVAIL'){
                this.notify.notify(res.message,"Error");
              }else{
                this.MakePaymnetResponse=res.data;          
               // this.OpenRazorpayModal();
                  this.cashfressRedirect();
              }
              
            }else{
              this.notify.notify(res.message,"Error");
            } 

            this.spinner.hide();  

        });
     
  }

   }

   razorpay:any;

   handleEvent(event:any){    
    if(event.action === 'done'){
      this.razorpay.close();
      this.notify.notify("Time Out","Error");
      window.location.href=(this.platformLocation as any).location.origin;
    }
  }


  public OpenRazorpayModal() {

    
  this.spinner.hide();


   const RAZORPAY_OPTIONS :any = {
      "key": this.MakePaymnetResponse.key,
      "amount": this.MakePaymnetResponse.amount,
      "name": "ODBUS PAYMENT",
      "order_id": this.MakePaymnetResponse.razorpay_order_id,
      "description": "",
      "image": "assets/img/odbus-logo.svg",
      "prefill": {
        "name": this.passengerData.customerInfo.name,
        "email": this.passengerData.customerInfo.email,
        "contact": '+91'+this.passengerData.customerInfo.phone,
        "method": ""
      },
      "modal": {},
      "theme": {
        "color": "#d39e00"
      }
    };

    
    RAZORPAY_OPTIONS['handler'] = this.razorPaySuccessHandler.bind(this); 
    this.razorpay = new Razorpay(RAZORPAY_OPTIONS)
    this.razorpay.open();  

  }

  pnr:any;

  razorPaySuccessHandler(res: any) { 
    
    if(res && res.razorpay_signature && res.razorpay_payment_id){ 


       localStorage.setItem('od_success_name',this.passengerData.customerInfo.name);
       localStorage.setItem('od_success_email',this.passengerData.customerInfo.email);
       localStorage.setItem('od_success_phone',this.passengerData.customerInfo.phone);
       localStorage.setItem('od_razor_id',res.razorpay_payment_id);

     
       window.location.href="/success";


   }

   this.loadingText = 'Loading...';
  }

  getBack(){
    if((this.bookingStep2==false && this.bookingStep3==false) || (this.bookingStep2==false && this.bookingStep3==true)){
      this.router.navigate(['/']);
    }

    if(this.bookingStep2==true && this.bookingStep3==false){
      this.bookingStep2= false;
    }
  }

  print(): void {
    var printButton = document.getElementById('print_btn');
    printButton.style.visibility = 'hidden';
    const printContents = document.getElementById('print-section').innerHTML;
    const popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
   
    popupWin.document.write(`
        <html>
            <head>
                <title>Print Page</title>
                <style>
                .container {
                  max-width:1320px !important;
                  margin:0 auto ;
              }
              
              .od-body{
                  border:3px solid #323232;
                  padding: 25px;
                  margin-top: 20px;
              }
              
              .row {
               display: flex;
               flex-wrap: wrap;
               margin-right: -15px;
               margin-left: -15px;
              }
              
              .od-logo{
                 height: 80px;
              }
              
              .odtext24 h3{
                 font-size:20px;
                 text-align: left;
                 line-height:26px;
                 font-weight:600;
                 color: #323232;
              }
              
              .odtext32{
                 font-size:28px;
                 text-align: center;
                 line-height:34px;
                 font-weight:600;
                 padding-top: 8px;
                 color: #043c5d;
              }
              
              .odtext32 span{
                 font-weight: 800;
              }
              
              .od-bktext{
                 font-size:18px;
                 text-align: center;
                 line-height: 22px;
                 color: #000000;
                 border:1px solid #c4c4c4 ;
                 padding:8px ;
                 font-weight: 600;
              }
              .od-banner{
                 width: 100%;
              }
              .od-qrcode{
                 background:#c4c4c4;
                 padding: 15px;
                 width: 100%;
                 margin-top: 34px;
              }
              .mt30{
               margin-top: 35px;
              }
              .mb25{
                 
                 margin-bottom: 35px;
              }
              
              .mb40{
                 margin-bottom: 40px;
              }
              
              .odbox1{
               border: 1px solid #c4c4c4;
               padding:25px 15px;
              }
              
              .odbox1 ol{
               margin-left: -20px;
              }
              
              .odbox2{
               border: 1px solid #000000;
               padding:25px 15px;
              }
              
              .odbox2 p{
               font-size:18px;
               color: #000000;
               font-weight: 600;
               margin-bottom: 8px;
              }
              
              .odbox3 p{
               font-size:18px;
               color: #000000;
               font-weight: 600;
               margin-bottom: 8px;
               text-align: right;
              }
                </style>
            </head>
            <body
                style="font-size: 13px;
                    font-family: 'Source Sans Pro', 'Helvetica Neue',
                    Helvetica, Arial, sans-serif;
                    color: #333";
                onload="document.execCommand('print');window.close()">${printContents}</body>
        </html>`
    );
    printButton.style.visibility = 'visible';
    popupWin.document.close();
  }  

  user :any=[];
  isSignedIn: boolean;

   myDate:any = new Date();

   customer_gst:any='';

   notice:any='';
   
  ngOnInit() { 

    this.generateCaptcha();

    const data={
      user_id:GlobalConstants.MASTER_SETTING_USER_ID
    };

    this.commonService.getCommonData(data).subscribe(
      resp => {
        this.masterSettingRecord=resp.data; 

        this.customer_gst=this.masterSettingRecord.common.customer_gst;

        //console.log(this.masterSettingRecord.common.customer_gst);
      });

    this.passengerData=this.bookForm1.value;
    
    const entdt:any =localStorage.getItem('entdate'); 

    this.myDate = this.datePipe.transform(this.myDate, 'dd-MM-yyyy');


    if(this.myDate == entdt){
      if(this.busRecord.origin=='ODBUS'){
        this.notice="Cancellation/Refund is not allowed on this Ticket";
      }
      
      //console.log(this.myDate);
      //console.log(entdt);
    }

    // console.log(this.myDate);
    // console.log(entdt);

   // if(moment(this.myDate) > moment(entdt)){
     // this.router.navigate(['/']);
    //}
  }
 
  showPreviousStep(event?: Event) {
    this.ngWizardService.previous();
  }
 
  showNextStep(event?: Event) {
    this.ngWizardService.next();
    
  }
 
  resetWizard(event?: Event) {
    this.ngWizardService.reset();
  }
 
  setTheme(theme: THEME) {
    this.ngWizardService.theme(theme);
  }
 
  stepChanged(args: StepChangedArgs) {
    //console.log(args);
  }
 
  isValidTypeBoolean: boolean = true;
 
  isValidFunctionReturnsBoolean(args: StepValidationArgs) {
    return true;
  }
 
  isValidFunctionReturnsObservable(args: StepValidationArgs) {    
    return this.tabclick;
  }

  number1: number;
  number2: number;
  captchaResult: number;
  errorMessage: string;
 captchaValidated:boolean=false;

  generateCaptcha(): void {
    this.number1 = Math.floor(Math.random() * 10) + 1;
    this.number2 = Math.floor(Math.random() * 10) + 1;
    this.captchaResult = this.number1 + this.number2;
    this.errorMessage = '';
    this.captchaValidated=false;
    this.bookForm2.patchValue( {'userInput':null} );
  }

  validateCaptcha(): void {
    if (this.bookForm2.value.userInput == this.captchaResult) {
      this.errorMessage = '';
     this.captchaValidated=true;
    } else {
      this.errorMessage = 'Incorrect answer. Please try again.';
      this.captchaValidated=false;
     console.log(this.errorMessage);
    }

    
  }

 async cashfressRedirect(){
  //console.log(this.MakePaymnetResponse);
  //console.log(this.MakePaymnetResponse.razorpay_order_id.payment_session_id);
  //console.log(this.MakePaymnetResponse.razorpay_order_id.receipt_id);
    const cashfree=await load({
      mode:"production" //production , sandbox
    });
    const checkOptions={
      paymentSessionId:this.MakePaymnetResponse.razorpay_order_id.payment_session_id,
      redirectTarget:"_modal" // _blank , _self
    }
   
    cashfree.checkout(checkOptions).then((result) => {
      if(result.error){
          alert('payment failed');
      }
      if(result.paymentDetails){

        localStorage.setItem('od_success_name',this.passengerData.customerInfo.name);
        localStorage.setItem('od_success_email',this.passengerData.customerInfo.email);
        localStorage.setItem('od_success_phone',this.passengerData.customerInfo.phone);
        localStorage.setItem('receipt_id',this.MakePaymnetResponse.razorpay_order_id.receipt_id);

        window.location.href="/success";
      }

    });
  }
}

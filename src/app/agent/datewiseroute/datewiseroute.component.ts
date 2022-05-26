import { Component, OnInit, VERSION } from '@angular/core';
import { AgentreportService } from '../../services/agentreport.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DatePipe} from '@angular/common';
import { ManagebookingService } from '../../services/managebooking.service';
import { BusOperatorService } from './../../services/bus-operator.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompleteReport } from '../../model/completereport';
import { LocationService } from '../../services/location.service';
import { BusService } from '../../services/bus.service';
import { NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { Constants } from '../../constant/constant';
import * as XLSX from 'xlsx';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from '../../services/notification.service';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import { WalletbalanceService } from '../../services/walletbalance.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-datewiseroute',
  templateUrl: './datewiseroute.component.html',
  styleUrls: ['./datewiseroute.component.scss'],
  providers: [DatePipe]
})
export class DatewiserouteComponent implements OnInit {

  public searchFrom: FormGroup;

  completeReport: CompleteReport[];
  completeReportRecord: CompleteReport;
  todayDate:any;
  completedata: any = '';
  totalfare = 0;
  busoperators: any;
  url: any;
  locations: any;
  buses: any;
  currentDate = new Date();
  qrCode:any='';
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  singleRecord: any;
  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;

  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  qrcode:any = '';

  cancelInfo:any=[];


  submitted = false;
  Otpsubmitted = false;
  ResendOtp :boolean=false;
  ResendTimer :boolean=true;
  Timer= 20;  
  alert:any='';

  public cancelForm: FormGroup;
  public FinalcancelForm: FormGroup;
  index: any;
  


  constructor(
    
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private rs: AgentreportService,   
    private notificationService: NotificationService,
    private busOperatorService: BusOperatorService,
    private fb: FormBuilder,
    private locationService: LocationService,
    private busService: BusService,
    private calendar: NgbCalendar,
    private managebookingService: ManagebookingService,
    public balance: WalletbalanceService,
    public router: Router,
    public formatter: NgbDateParserFormatter,    
    private modalService: NgbModal,
    config: NgbModalConfig,
    private datePipe: DatePipe
  ) {
    
    this.todayDate =this.datePipe.transform((new Date), 'yyyy-MM-dd'); 
    config.backdrop = 'static';
    config.keyboard = false;
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getToday();

    this.cancelForm = this.fb.group({
      pnr: ['', Validators.required],
      // mobile: ['', [Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]]
    });

  }
  title = 'angular-app';
  fileName = 'Agent-Complete-Report.xlsx';
  ngOnInit(): void {
    // this.spinner.show();
    this.searchFrom = this.fb.group({
      date: [null],
      rows_number: Constants.RecordLimit,
      source_id: [null],
      destination_id: [null]
    })
    this.loadServices();
  }

  search(pageurl = "") {
   
    if( this.searchFrom.value.source_id == null ||this.searchFrom.value.destination_id == null ||this.searchFrom.value.date == null)
    {
      this.notificationService.notify("All Fields Are Required","Error");
      return
    }
    else{
    this.spinner.show();
    this.completeReportRecord = this.searchFrom.value;

    const data = {
      source_id: this.completeReportRecord.source_id,
      destination_id: this.completeReportRecord.destination_id,
      date: this.completeReportRecord.date,
      user_id: localStorage.getItem('USERID'),
    };
    // console.log(data);
    if (pageurl != "") {
      this.rs.datewiseroutepagination(pageurl, data).subscribe(
        res => {
          this.completedata = res.data;
          this.spinner.hide();
        }
      );
    }
    else {
      this.rs.datewiseroute(data).subscribe(
        res => {
          this.completedata = res.data.data;
          this.spinner.hide();
        }
      );
    }

  }

  }

  refresh() {
    this.spinner.show();
    this.searchFrom = this.fb.group({
      date: [null],  
      rows_number: Constants.RecordLimit,
      source_id: [null],
      destination_id: [null]
    })
    this.search();
  }

  loadServices() {

    this.busOperatorService.readAll().subscribe(
      res => {
        this.busoperators = res.data;
      }
    );
    this.locationService.readAll().subscribe(
      records => {
        this.locations = records.data;
      }
    );
  }




}

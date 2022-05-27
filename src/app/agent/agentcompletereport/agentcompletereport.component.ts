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
  selector: 'app-agentcompletereport',
  templateUrl: './agentcompletereport.component.html',
  styleUrls: ['./agentcompletereport.component.scss'],
  providers: [DatePipe]
})
export class AgentcompletereportComponent implements OnInit {

  public searchFrom: FormGroup;

  completeReport: CompleteReport[];
  completeReportRecord: CompleteReport;
  todayDate:any;
  completedata: any;
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
      mobile: ['', [Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]]
    });

    this.FinalcancelForm = this.fb.group({
      otp: ['', Validators.required],
    });
  }
  title = 'angular-app';
  fileName = 'Agent-Complete-Report.xlsx';
  ngOnInit(): void {
    this.spinner.show();
    this.searchFrom = this.fb.group({
      bus_operator_id: [null],
      rangeFromDate: [null],
      rangeToDate: [null],
      payment_id: [null],
      date_type: ['booking'],
      rows_number: Constants.RecordLimit,
      source_id: [null],
      destination_id: [null]
    })
    this.search();
  }

  exportexcel(): void {

    /* pass here the table id */
    let element = document.getElementById('export-section');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);

  }

  page(label: any) {
    return label;
  }
  search(pageurl = "") {
    this.spinner.show();
    this.completeReportRecord = this.searchFrom.value;

    const data = {
      bus_operator_id: this.completeReportRecord.bus_operator_id,
      date_type: this.completeReportRecord.date_type,
      rows_number: this.completeReportRecord.rows_number,
      rangeFromDate: this.completeReportRecord.rangeFromDate,
      rangeToDate: this.completeReportRecord.rangeToDate,
      user_id: localStorage.getItem('USERID'),
    };
    // console.log(data);
    if (pageurl != "") {
      this.rs.completepaginationReport(pageurl, data).subscribe(
        res => {
          this.completedata = res.data;
          // console.log( this.completedata);
          this.spinner.hide();
        }
      );
    }
    else {
      this.rs.completeReport(data).subscribe(
        res => {
          this.completedata = res.data;
          console.log( this.completedata);
          this.spinner.hide();
        }
      );
    }



  }




  ///////////////Function to Copy data to Clipboard/////////////////
  copyMessage($event: any) {
    // console.log($event);
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = $event;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  refresh() {
    this.spinner.show();
    this.searchFrom = this.fb.group({
      bus_operator_id: [null],
      rangeFromDate: [null],
      rangeToDate: [null],
      payment_id: [null],
      date_type: ['booking'],
      rows_number: Constants.RecordLimit,
      source_id: [null],
      destination_id: [null]

    })
    this.search();
  }


 
}
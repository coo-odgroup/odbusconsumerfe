import { Component, OnDestroy, OnInit, ElementRef, ViewChild } from '@angular/core';

// import {
//   Chart,
//   registerables
// } from 'chart.js';

// Chart.register(...registerables);

@Component({
  selector: 'app-join-as-agent',
  templateUrl: './join-as-agent.component.html',
  styleUrls: ['./join-as-agent.component.css']
})
export class JoinAsAgentComponent implements OnInit, OnDestroy {

  constructor() { }

  private scriptId = 'tailwind-cdn';

  ngOnInit(): void {
    if (!document.getElementById(this.scriptId)) {
      const script = document.createElement('script');
      script.id = this.scriptId;
      script.src = 'https://cdn.tailwindcss.com';
      document.head.appendChild(script);
    }
  }

  ngOnDestroy(): void {
    const script = document.getElementById(this.scriptId);
    if (script) {
      script.remove();
    }
  }

  @ViewChild('incomeChart')
  incomeChartCanvas!: ElementRef<HTMLCanvasElement>;

  // chart!: Chart;

  ticketCount = 15;

  avgFare = 850;

  baseComm = 0;

  addonComm = 0;

  dailyProfit = 0;

  monthlyProfit = 0;

  activeFaq = -1;

  activeZone = 'coastal';

  routeData: any = {

    coastal: [
      { from: 'Bhubaneswar', to: 'Puri', ops: 'Chandan Bus' },
      { from: 'Cuttack', to: 'Berhampur', ops: 'Devdas Travels' },
      { from: 'Bhubaneswar', to: 'Balasore', ops: 'Binapani' },
      { from: 'Bhubaneswar', to: 'Baripada', ops: 'Ananya Srikunj' },
      { from: 'Puri', to: 'Konark', ops: 'Local Express' },
      { from: 'Bhadrak', to: 'Bhubaneswar', ops: 'Jagannath' },
      { from: 'Berhampur', to: 'Puri', ops: 'Maa Kali' },
      { from: 'Cuttack', to: 'Balasore', ops: 'Grand Coastal' }
    ],

    western: [
      { from: 'Bhubaneswar', to: 'Rourkela', ops: 'Green Baloon' },
      { from: 'Bhubaneswar', to: 'Sambalpur', ops: 'Sampark' },
      { from: 'Cuttack', to: 'Jharsuguda', ops: 'Shakti' },
      { from: 'Bhubaneswar', to: 'Balangir', ops: 'Sai Darshan' },
      { from: 'Sambalpur', to: 'Bargarh', ops: 'Maa Manikeswari' },
      { from: 'Rourkela', to: 'Jharsuguda', ops: 'Super Western' },
      { from: 'Bhubaneswar', to: 'Sonepur', ops: 'Gourav Bus' },
      { from: 'Cuttack', to: 'Nuapada', ops: 'Panchayat' }
    ],

    southern: [
      { from: 'Bhubaneswar', to: 'Rayagada', ops: 'Maa Thakurani' },
      { from: 'Bhubaneswar', to: 'Koraput', ops: 'Annapurna' },
      { from: 'Cuttack', to: 'Jeypore', ops: 'Mahadev' },
      { from: 'Cuttack', to: 'Malkangiri', ops: 'Satya Bus' },
      { from: 'Berhampur', to: 'Phulbani', ops: 'Gajapati' },
      { from: 'Bhubaneswar', to: 'Bhawanipatna', ops: 'Sun Express' },
      { from: 'Jeypore', to: 'Malkangiri', ops: 'Tribal King' },
      { from: 'Bhubaneswar', to: 'Gunupur', ops: 'Southern Star' }
    ],

    interstate: [
      { from: 'Kolkata', to: 'Bhubaneswar', ops: 'Mallick Bus' },
      { from: 'Ranchi', to: 'Bhubaneswar', ops: 'Grand Express' },
      { from: 'Raipur', to: 'Sambalpur', ops: 'SBP Express' },
      { from: 'Bhubaneswar', to: 'TATA', ops: 'Satya Travels' },
      { from: 'Surat', to: 'Bhubaneswar', ops: 'Pradhan Bus' },
      { from: 'Vizag', to: 'Berhampur', ops: 'Andhra Exp' },
      { from: 'Kolkata', to: 'Puri', ops: 'Holiday Spl' },
      { from: 'Chennai', to: 'Berhampur', ops: 'Coastal Long' }
    ]

  };

  selectedRoutes = this.routeData['coastal'];

  ngAfterViewInit(): void {

    // this.initChart();

    this.updateIncome();

  }

  // initChart(): void {

  //   this.chart = new Chart(this.incomeChartCanvas.nativeElement, {

  //     type: 'bar',

  //     data: {

  //       labels: [
  //         'Daily Profit',
  //         'Weekly Profit',
  //         'Monthly Profit'
  //       ],

  //       datasets: [
  //         {
  //           label: 'Income Projection',
  //           data: [0, 0, 0],
  //           backgroundColor: [
  //             '#E4532B',
  //             '#111827',
  //             '#10B981'
  //           ],
  //           borderRadius: 8,
  //           maxBarThickness: 50
  //         }
  //       ]

  //     },

  //     options: {

  //       responsive: true,

  //       maintainAspectRatio: false,

  //       plugins: {

  //         legend: {
  //           display: false
  //         }

  //       },

  //       scales: {

  //         x: {
  //           grid: {
  //             display: false
  //           }
  //         },

  //         y: {
  //           beginAtZero: true,
  //           grid: {
  //             display: false
  //           }
  //         }

  //       }

  //     }

  //   });

  // }

  updateIncome(): void {

    this.baseComm = Math.round(
      this.ticketCount * this.avgFare * 0.08
    );

    this.addonComm = Math.round(
      this.ticketCount * 17
    );

    this.dailyProfit =
      this.baseComm +
      this.addonComm;

    this.monthlyProfit =
      this.dailyProfit * 30;

    // if (this.chart) {

    //   this.chart.data.datasets[0].data = [

    //     this.dailyProfit,

    //     this.dailyProfit * 7,

    //     this.monthlyProfit

    //   ];

    //   this.chart.update();

    // }

  }

  switchRoute(zone: string): void {

    this.activeZone = zone;

    this.selectedRoutes = this.routeData[zone];

  }

  toggleFaq(index: number): void {

    this.activeFaq =
      this.activeFaq === index
        ? -1
        : index;

  }

}

import { Injectable } from '@angular/core';

export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  function?: any;
  badge?: {
    title?: string;
    type?: string;
  };
  children?: Navigation[];
}

export interface Navigation extends NavigationItem {
  children?: NavigationItem[];
}

const ApiClientItems = [
  {
    id: 'odbus',
    title: '',
    type: 'group',
    icon: 'feather icon-home',
    children: [
      {
        id: 'dashboards',
        title: 'Dashboards',
        type: 'item',
        icon: 'feather icon-home',
        url: 'dashboard/landing'
      },
      // {
      //   id: 'booking',
      //   title: 'Book Ticket',
      //   type: 'item',       
      //   icon: 'feather icon-gitlab',
      //   url: 'agent/booking'
      // },
      // {
      //   id: 'agentprofile',
      //   title: 'Agent Profile',
      //   type: 'item',       
      //   icon: 'feather icon-gitlab',
      //   url: 'agent/agentprofile'
      // },
      {
        id: 'wallet',
        title: 'Wallet Request',
        type: 'item',
        icon: 'feather icon-shield',
        url: 'apiclient/wallet'
      },
      {
        id: 'walletreport',
        title: 'All Transaction Report',
        type: 'item',
        icon: 'ng-tns-c12-3 feather icon-file-text',
        url: 'apiclient/alltransactionreport'
      } ,  
      {
        id: 'cancelTicket',
        title: 'Cancel Ticket',
        type: 'item',
        icon: 'ng-tns-c12-3 feather icon-file-text',
        url: 'apiclient/cancelTicket'
      },  
      {
        id: 'cancelreport',
        title: 'Cancel Ticket Report',
        type: 'item',
        icon: 'ng-tns-c12-3 feather icon-file-text',
        url: 'apiclient/cancelreport'
      },  
      {
        id: 'bookingreport',
        title: 'Booking Report',
        type: 'item',
        icon: 'ng-tns-c12-3 feather icon-file-text',
        url: 'apiclient/bookingreport'
      },  
      {
        id: 'datewiseroute',
        title: 'Datewise Route',
        type: 'item',
        icon: 'ng-tns-c12-3 feather icon-file-text',
        url: 'apiclient/datewiseroute'
      } ,  
      {
        id: 'clientissue',
        title: 'Client Issue',
        type: 'item',
        icon: 'ng-tns-c12-3 feather icon-file-text',
        url: 'apiclient/clientissue'
      }    
    ]
  },
  // {
  //   id: 'report',
  //   title: 'Reports',
  //   type: 'collapse',
  //   icon: 'feather icon-thermometer',
  //   children: [
  //     {
  //       id: 'walletreport',
  //       title: 'All Transaction Report',
  //       type: 'item',
  //       icon: 'ng-tns-c12-3 feather icon-file-text',
  //       url: 'agent/alltransactionreport'
  //     },
  //     {
  //       id: 'cancellationreport',
  //       title: 'Cancellation Report',
  //       type: 'item',
  //       icon: 'feather icon-pie-chart',
  //       url: 'agent/cancellationreport'
  //     },
  //     {
  //       id: 'completereport',
  //       title: 'Complete Report',
  //       type: 'item',
  //       icon: 'feather icon-pie-chart',
  //       url: 'agent/completereport'
  //     },
  //     {
  //       id: 'commissionreport',
  //       title: 'Commission Report',
  //       type: 'item',
  //       icon: 'feather icon-pie-chart',
  //       url: 'agent/commissionreport'
  //     },
     
     
  //     // {
  //     //   id: 'user',
  //     //   title: 'Operators',
  //     //   type: 'item',
  //     //   icon:'feather icon-users',
  //     //   url: 'setting/user'
  //     // },          
  //     // {
  //     //   id: 'association',
  //     //   title: 'Association',
  //     //   type: 'item',
  //     //   icon:'feather icon-user-plus',
  //     //   url: 'setting/association'
  //     // },
      
  //   ]
  // },
];

@Injectable()
export class NavigationItem {
  public get() {
    var ROLE_ID = localStorage.getItem("ROLE_ID");
    if (ROLE_ID == "6") {
      return ApiClientItems;
    }
  }
}

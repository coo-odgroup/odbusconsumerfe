import { Injectable } from '@angular/core';

@Injectable()
export class GlobalConstants {
  public static ismobile: boolean = true;

  // Live
  // public static BASE_URL:any ='https://consumer.odbus.co.in/api';
  // public static URL:any ='https://www.odbus.in/';
  // public static PATHURL: any = 'https://provider.odbus.co.in/uploads/';
  // public static PAYMENT_MODE: any = 'production';


  // Testing ADGLOB
  public static BASE_URL: any = 'https://odclient.adglob.in/api';
  public static URL: any = 'https://odbus.adglob.in/';
  public static PAYMENT_MODE: any = 'sandbox';
  public static PATHURL: any = 'https://odapi.adglob.in/uploads/';

  // Local
  // public static BASE_URL: any = 'http://localhost:7001/ODBUS/odbusconsumerbe/api';
  // public static URL: any = 'http://localhost:4200/';
  // public static PAYMENT_MODE: any = 'sandbox';
  // public static PATHURL:any = 'http://localhost:7001/ODBUS/odbusproviderbe/uploads/';


  public static USER_ID: any = '';
  public static MASTER_SETTING_USER_ID: any = '1';
}

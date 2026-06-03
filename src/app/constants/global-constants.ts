import { Injectable } from '@angular/core';

@Injectable()
export class GlobalConstants {
  public static ismobile: boolean = true;

  // Live
  // public static BASE_URL:any ='https://consumer.odbus.co.in/api';
  // public static URL:any ='https://www.odbus.in/';
  // public static PATHURL: any = 'https://consumer.odbus.co.in/public/uploads/';
  // public static PAYMENT_MODE: any = 'production';

  // SSR Build
  // public static BASE_URL: any = 'https://testing.odbus.co.in/api';
  // public static URL:any ='https://odtestingssr.odbus.co.in/';
  // public static PAYMENT_MODE: any = 'sandbox';
  // public static PATHURL: any = 'https://testingadminapi.odbus.co.in/public/uploads/';

  // Testing
  // public static BASE_URL: any = 'https://testing.odbus.co.in/api';
  // // public static URL: any = 'https://odtesting.odbus.co.in/';
  // public static URL: any = 'http://localhost:4200/';
  // public static PAYMENT_MODE: any = 'sandbox';
  // public static PATHURL: any = 'https://testingadminapi.odbus.co.in/public/uploads/';

  // Local
  public static BASE_URL: any = 'http://localhost:7001/ODBUS/odbusconsumerbe/api';
  public static URL: any = 'http://localhost:4200/';
  public static PAYMENT_MODE: any = 'sandbox';
  public static PATHURL:any = 'http://localhost:7001/ODBUS/odbusproviderbe/public/uploads/';


  public static USER_ID: any = '';
  public static MASTER_SETTING_USER_ID: any = '1';
}

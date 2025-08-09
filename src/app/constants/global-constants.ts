import { Injectable } from "@angular/core";

@Injectable()
export class GlobalConstants {  
    public static ismobile: boolean= true;
   
   // public static BASE_URL:any ='https://consumer.odbus.co.in/api';
   // public static URL:any ='https://www.odbus.in/';
   // public static PAYMENT_MODE:any ='production';
   
//    public static BASE_URL:any ='https://testing.odbus.co.in/api';
//    public static URL:any ='https://odtesting.odbus.co.in/';
   public static PAYMENT_MODE:any ='sandbox';
   //public static URL:any ='http://localhost:4200/';

   public static BASE_URL:any ='https://localhost/api';
    public static URL:any ='http://localhost:4200/';

   public static USER_ID:any = "";
   public static MASTER_SETTING_USER_ID:any = "1";
}
import { Injectable } from "@angular/core";

@Injectable()
export class GlobalConstants {  
    public static ismobile: boolean= true;
    //public static BASE_URL:any ='http://127.0.0.1:8000/api';  
    public static BASE_URL:any ='https://consumer.odbus.co.in/api';
    public static USER_ID:any = "";
    public static MASTER_SETTING_USER_ID:any = "1";
}
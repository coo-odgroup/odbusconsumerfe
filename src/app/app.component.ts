import { Component, Inject} from '@angular/core';
import { AuthService } from './services/auth.service';
import { Title, Meta } from '@angular/platform-browser';
import { SeoService } from './services/seo.service';
import { DOCUMENT } from '@angular/common';
import{ GlobalConstants } from './constants/global-constants';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Router } from '@angular/router';
import { CommonService } from './services/common.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  meta_title:any;
  meta_keyword:any;
  meta_description:any;
  logo: any='';
  og_image:any='';
  common:any=[];

  isMobile:boolean=false;

  constructor(@Inject(DOCUMENT) private doc,private auth: AuthService,
    private titleService: Title, 
    private metaService: Meta,
    private seo:SeoService,
    private commonService: CommonService,
    private deviceService: DeviceDetectorService,
    public router: Router
    ) {

    this.auth.getToken().subscribe(
      res=>{
        localStorage.setItem('AuthAccessToken',res.data);        
      }
    );
   
  }

   ngOnInit() {

    this.isMobile = this.deviceService.isMobile();

    const data={
     user_id:GlobalConstants.MASTER_SETTING_USER_ID
    };

    this.commonService.getCommonData(data).subscribe(
      resp => {
        if(resp.data.common.maintenance==1){
          this.router.navigate(['maintenance']); 
        }

       this.commonService.setCommonData(resp.data);

      


       // console.log(resp);

        // this.logo=resp.data.common.logo_image;
        // this.og_image=resp.data.common.og_image;

        this.common=resp.data.common;


        this.meta_description=this.common.meta_description;
        this.meta_title=this.common.meta_title;
        this.meta_keyword=this.common.meta_keyword;
       
        // this.seo.deafultmeta_description.subscribe((s:any) => { this.meta_description = s});
        // this.seo.deafultmeta_title.subscribe((s:any) => { this.meta_title = s});
        // this.seo.deafultmeta_keyword.subscribe((s:any) => { this.meta_keyword = s});

        this.titleService.setTitle(this.meta_title);

       const metaArr= [
          {name: 'keywords', content: this.meta_keyword},
          {name: 'description', content: this.meta_description},
          { name: 'og:url', content: this.doc.URL },
          { name: 'og:type', content: "website" },
          { name: 'og:title', content: this.meta_title },
          { name: 'og:description', content: this.meta_description }      
        ];        

        if(this.og_image!='' && this.og_image!=null){
          metaArr.push({ name: 'og:image', content: this.og_image });
        }

        if(this.common.google_verification_code!='' && this.common.google_verification_code!=null){
          metaArr.push({ name: 'google-site-verification', content: this.common.google_verification_code });
        }

        if(this.common.bing_verification_code!='' && this.common.bing_verification_code!=null){
          metaArr.push({ name: 'msvalidate.01', content: this.common.bing_verification_code });
        }

        if(this.common.pintrest_verification_code!='' && this.common.pintrest_verification_code!=null){
          metaArr.push({ name: 'p:domain_verify', content: this.common.pintrest_verification_code });
        }

        this.metaService.addTags(metaArr);

        if(this.common.google_analytics!='' && this.common.google_analytics!=null){
         
          let chatScript = document.createElement("script");
          chatScript.type = "text/javascript";
          chatScript.async = true;
          chatScript.src = this.common.google_analytics;
          chatScript.id = "google_analytics";
          document.head.appendChild(chatScript);
         
        }

        if(this.common.no_script!='' && this.common.no_script!=null){
         
          let chatScript = document.createElement("noscript");
          chatScript.innerHTML  = this.common.no_script;
          chatScript.id = "noscript";
          document.head.append(chatScript);
         
        }

        if(this.isMobile== false && this.common.seo_script!='' && this.common.seo_script!=null){
         
          let chatScript = document.createElement("script");
          chatScript.innerHTML = this.common.seo_script;  
          chatScript.id = "seo_script";
          document.head.append(chatScript);
         
        }

        


      });


    

   }

  
}

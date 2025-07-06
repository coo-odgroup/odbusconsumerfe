import { NgModule,APP_INITIALIZER ,CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgSelectModule } from '@ng-select/ng-select';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { SearchComponent } from './search/search.component';
import { PageErrorComponent } from './page-error/page-error.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppInitializerService } from './services/initializer.service';
import { BookingComponent } from './booking/booking.component';
import { NgWizardModule, NgWizardConfig, THEME } from 'ng-wizard';
import { TestimonialsComponent } from './testimonials/testimonials.component';
import { OperatorsComponent } from './operators/operators.component';
import { TncComponent } from './tnc/tnc.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { ManageBookingComponent } from './manage-booking/manage-booking.component';
import { SupportComponent } from './support/support.component';
import { FaqComponent } from './faq/faq.component';
import { ThankyouComponent } from './thankyou/thankyou.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { NewsComponent } from './news/news.component';
import { CareersComponent } from './careers/careers.component';
import { RoutesComponent } from './routes/routes.component';
import { OffersComponent } from './offers/offers.component';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { ManagebookingdetailsComponent } from './managebookingdetails/managebookingdetails.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import {ToastrModule} from 'ngx-toastr';
import { OtpComponent } from './otp/otp.component'
import { NgbDate, NgbDateParserFormatter, NgbModule,NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomdateformatService } from "./services/customdateformat.service";
import { NgxSpinnerModule } from "ngx-spinner";
import { AuthInterceptor } from './shared/auth.interceptor';
import { MyaccountComponent } from './user/myaccount/myaccount.component';
import { UserdashboardComponent } from './user/userdashboard/userdashboard.component';
import { UsernavbarComponent } from './user/usernavbar/usernavbar.component';
import { JwtHelperService, JWT_OPTIONS  } from '@auth0/angular-jwt';
import { UsernotificationsComponent } from './user/usernotifications/usernotifications.component';
import { UserwalletComponent } from './user/userwallet/userwallet.component';
import { UserinvitefriendsComponent } from './user/userinvitefriends/userinvitefriends.component';
import { UserrewardsComponent } from './user/userrewards/userrewards.component';
import { UserreviewsComponent } from './user/userreviews/userreviews.component';
import { UserhelpsupportComponent } from './user/userhelpsupport/userhelpsupport.component';
import { OperatorDetailComponent } from './operator-detail/operator-detail.component';
import { AuthGuard } from './helpers/auth.guard';
import { CountdownModule } from 'ngx-countdown';
import {IvyCarouselModule} from 'angular-responsive-carousel';
import { AuthModule } from '@auth0/auth0-angular';
import { ImageCropperModule } from 'ngx-image-cropper';
import { LightboxModule } from 'ngx-lightbox';
import { FilterPipe } from './filter.pipe';
import { QRCodeModule } from 'angular2-qrcode';
import { PnrdetailComponent } from './pnrdetail/pnrdetail.component';
import { ApiComponent } from './api/api.component';
import { SuccessComponent } from './success/success.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { ProfiledeleteComponent } from './profiledelete/profiledelete.component';
import { environment } from '../environments/environment';
export function appInit(appInitializerService: AppInitializerService) {
  return () => appInitializerService.load();
}


export function tokenGetter() {
  return localStorage.getItem("access_token");
}



const ngWizardConfig: NgWizardConfig = {
  theme: THEME.default
};

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    SearchComponent,
    PageErrorComponent,
    BookingComponent,
    TestimonialsComponent,
    OperatorsComponent,
    TncComponent,
    PrivacyPolicyComponent,
    ManageBookingComponent,
    SupportComponent,
    FaqComponent,
    ThankyouComponent,
    ContactUsComponent,
    AboutUsComponent,
    NewsComponent,
    CareersComponent,
    RoutesComponent,
    OffersComponent,
    ManagebookingdetailsComponent,
    SignupComponent,
    LoginComponent,
    OtpComponent,
    MyaccountComponent,
    UserdashboardComponent,
    UsernavbarComponent,
    UsernotificationsComponent,
    UserwalletComponent,
    UserinvitefriendsComponent,
    UserrewardsComponent,
    UserreviewsComponent,
    UserhelpsupportComponent,
    OperatorDetailComponent,
    FilterPipe,
    PnrdetailComponent,
    ApiComponent,
    SuccessComponent,
    MaintenanceComponent,
    ProfiledeleteComponent
  ], 
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule,
    NgWizardModule.forRoot(ngWizardConfig),
    AutocompleteLibModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    NgxSpinnerModule,
    NgbProgressbarModule,
    CountdownModule ,
    IvyCarouselModule,
    AuthModule.forRoot({
      domain: 'dev-seofied.us.auth0.com',
      clientId: 'RsznkkMUqmJD0nUXjYv2LS8HPopT4xy1'
    }),
    ImageCropperModule,
    LightboxModule,
    QRCodeModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA],
  providers: [AppInitializerService,
    {
      provide: APP_INITIALIZER,
      useFactory: appInit,
      multi: true,
      deps: [AppInitializerService]
    },
    {provide: NgbDateParserFormatter, useClass: CustomdateformatService},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    
    JwtHelperService,
    AuthGuard
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }

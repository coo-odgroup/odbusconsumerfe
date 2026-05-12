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
import { AppInitializerService } from './services/initializer.service';
import { BookingComponent } from './booking/booking.component';
import { NgWizardModule, NgWizardConfig, THEME } from 'ng-wizard';
import { OperatorsComponent } from './operators/operators.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { ManageBookingComponent } from './manage-booking/manage-booking.component';
import { SupportComponent } from './support/support.component';
import { ThankyouComponent } from './thankyou/thankyou.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { NewsComponent } from './news/news.component';
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
import { PaymentStatusModule } from './payment-status/payment-status.module';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BlogListingComponent } from './bloglisting/bloglisting.component';
import { BlogDetailComponent } from './blogdetails/blogdetails.component';
import { RecentSearchComponent } from './home/recent-search/recent-search.component';
import { AdvantageComponent } from './home/advantage/advantage.component';
import { GrowingComponent } from './home/growing/growing.component';
import { DownloadAppComponent } from './home/download-app/download-app.component';
import { OdbusOffersComponent } from './home/odbus-offers/odbus-offers.component';
import { FaqsComponent } from './home/faqs/faqs.component';
import { InfoComponent } from './home/info/info.component';
import { RouteLinksComponent } from './home/route-links/route-links.component';
import { TopOperatorsComponent } from './home/top-operators/top-operators.component';
import { TopRoutesComponent } from './home/top-routes/top-routes.component';
import { CommonContentComponent } from './common-content/common-content.component';
import { FooterMenuComponent } from './footer-menu/footer-menu.component';
import { SearchBoxComponent } from './search-box/search-box.component';


export function appInit(appInitializerService: AppInitializerService) {
  return () => appInitializerService.load();
}


export function tokenGetter() {
  // Only access localStorage in browser
  if (typeof window !== 'undefined' && window.localStorage) {
    return localStorage.getItem("access_token");
  }
  return null;
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
    OperatorsComponent,
    PrivacyPolicyComponent,
    ManageBookingComponent,
    SupportComponent,
    ThankyouComponent,
    AboutUsComponent,
    NewsComponent,
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
    ProfiledeleteComponent,
    BlogListingComponent,
    BlogDetailComponent,
    RecentSearchComponent,
    AdvantageComponent,
    GrowingComponent,
    DownloadAppComponent,
    OdbusOffersComponent,
    FaqsComponent,
    InfoComponent,
    RouteLinksComponent,
    TopOperatorsComponent,
    TopRoutesComponent,
    CommonContentComponent,
    FooterMenuComponent,
    SearchBoxComponent
  ], 
  imports: [
    // BrowserAnimationsModule,
    NoopAnimationsModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AppRoutingModule,
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
      clientId: 'RsznkkMUqmJD0nUXjYv2LS8HPopT4xy1',
      httpInterceptor: {
        allowedList: ['*'] // Allow all requests to be intercepted
      },
      cacheLocation: 'localstorage' // Use localStorage for token storage
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

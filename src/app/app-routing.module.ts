import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
  CanActivate,
  Router,
  Route,
} from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { PageErrorComponent } from './page-error/page-error.component';
import { SearchComponent } from './search/search.component';
import { BookingComponent } from './booking/booking.component';
import { ApiComponent } from './api/api.component';
import { ManageBookingComponent } from './manage-booking/manage-booking.component';
import { ManagebookingdetailsComponent } from './managebookingdetails/managebookingdetails.component';
import { ThankyouComponent } from './thankyou/thankyou.component';
import { OffersComponent } from './offers/offers.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { OtpComponent } from './otp/otp.component';
import { MyaccountComponent } from './user/myaccount/myaccount.component';
import { UserdashboardComponent } from './user/userdashboard/userdashboard.component';
import { UsernotificationsComponent } from './user/usernotifications/usernotifications.component';
import { UserwalletComponent } from './user/userwallet/userwallet.component';
import { UserinvitefriendsComponent } from './user/userinvitefriends/userinvitefriends.component';
import { UserrewardsComponent } from './user/userrewards/userrewards.component';
import { UserreviewsComponent } from './user/userreviews/userreviews.component';
import { UserhelpsupportComponent } from './user/userhelpsupport/userhelpsupport.component';
import { AuthGuard } from './helpers/auth.guard';
import { SeoService } from './services/seo.service';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { PopularRoutesService } from './services/popular-routes.service';
import { PnrdetailComponent } from './pnrdetail/pnrdetail.component';
import { SuccessComponent } from './success/success.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { ProfiledeleteComponent } from './profiledelete/profiledelete.component';
import { PaymentStatusComponent } from './payment-status/payment-status.component';
import { CommonContentComponent } from './common-content/common-content.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'pnr', component: PageErrorComponent },
  { path: 'pnr/:id', component: PnrdetailComponent },
  { path: 'listing', component: SearchComponent },
  { path: 'success', component: SuccessComponent },
  { path: 'booking', component: BookingComponent },
  {
    path: 'about-us',
    loadChildren: () =>
      import('./about-us/about-us.module')
        .then(m => m.AboutUsModule)
  },
  { path: 'manage-booking', component: ManageBookingComponent },
  { path: 'manage-booking-detail', component: ManagebookingdetailsComponent },
  {
    path: 'operators',
    loadChildren: () =>
      import('./operators/operators.module')
        .then(m => m.OperatorsModule)
  },
  {
    path: 'routes',
    loadChildren: () =>
      import('./routes/routes.module')
        .then(m => m.RoutesModule)
  },
  { path: 'offers', component: OffersComponent },
  {
    path: 'testimonials',
    loadChildren: () =>
      import('./testimonials/testimonials.module')
        .then(m => m.TestimonialsModule)
  },
  {
    path: 'careers',
    loadChildren: () =>
      import('./careers/careers.module')
        .then(m => m.CareersModule)
  },
  {
    path: 'contact-us',
    loadChildren: () =>
      import('./contact-us/contact-us.module')
        .then(m => m.ContactUsModule)
  },
  {
    path: 'faq',
    loadChildren: () =>
      import('./faq/faq.module')
        .then(m => m.FaqModule)
  },
  {
    path: 'terms-conditions',
    loadChildren: () =>
      import('./tnc/tnc.module')
        .then(m => m.TncModule)
  },
  {
    path: 'privacy-policy',
    loadChildren: () =>
      import('./privacy-policy/privacy-policy.module')
        .then(m => m.PrivacyPolicyModule)
  },
  { path: '404', component: PageErrorComponent },
  {
    path: 'thank-you', loadChildren: () =>
      import('./thankyou/thankyou.module')
        .then(m => m.ThankyouModule)
  },
  {
    path: 'signup',
    loadChildren: () =>
      import('./signup/signup.module')
        .then(m => m.SignupModule)
  },
  // { path: 'signup', component: SignupComponent },
  {
    path: 'login', loadChildren: () =>
      import('./login/login.module')
        .then(m => m.LoginModule)
  },
  {
    path: 'otp', loadChildren: () =>
      import('./otp/otp.module')
        .then(m => m.OtpModule)
  },
  {
    path: 'thankyou',
    component: ThankyouComponent
  },

  {
    path: 'api-reference', loadChildren: () =>
      import('./api/api.module')
        .then(m => m.ApiModule)
  },

  {
    path: 'maintenance', loadChildren: () =>
      import('./maintenance/maintenance.module')
        .then(m => m.MaintenanceModule)
  },


  {
    path: '',
    loadChildren: () =>
      import('./user/user.module')
        .then(m => m.UserModule),
    canActivate: [AuthGuard]
  },


  { path: 'profile/delete', component: ProfiledeleteComponent },
  { path: 'payment-status', component: PaymentStatusComponent },
  // { path: 'slug', component: CommonContentComponent },
  {
    path: 'advantage/:slug',
    component: CommonContentComponent,
  },
  {
    path: 'blog',
    loadChildren: () =>
      import('./bloglisting/blog.module')
        .then(m => m.BlogModule)
  },

  // { path: 'payment-failed',component:PaymentFailedComponent},
  // { path: '**', component: SearchComponent}, // wildcard routes
  // { path: '**/:dt', component: SearchComponent}, // wildcard routes

  { path: 'routes/:slug', component: SearchComponent },
  { path: ':slug', component: SearchComponent },
  // { path: '**', redirectTo: '' },
  { path: '**', component: PageErrorComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'reload',
      scrollPositionRestoration: 'enabled',
      initialNavigation: 'enabledBlocking'
    }),
  ],
  exports: [RouterModule],
  providers: [{ provide: LocationStrategy, useClass: PathLocationStrategy }],
})
export class AppRoutingModule {
  currentUrl: any;

  constructor(
    private seo: SeoService,
    private router: Router,
    private popularRoutesService: PopularRoutesService,
  ) {
    // this.popularRoutesService.allroutes().subscribe(
    //   res=>{
    //     if(res.status==1)
    //     {
    //       if(res.data.length>0){
    //         res.data.forEach(e => {
    //           let r: Route = {
    //             path: e.source[0].url+'-'+e.destination[0].url+'-bus-services',
    //             component: SearchComponent
    //           };
    //           routes.push(r);
    //         });
    //     }
    //     this.router.resetConfig(routes);
    //   }
    //   });
  }
}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'wallet',
    loadChildren: () =>
      import('./userwallet/userwallet.module')
        .then(m => m.UserwalletModule)
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./userdashboard/userdashboard.module')
        .then(m => m.UserdashboardModule),
  },
  {
    path: 'notifications',
    loadChildren: () =>
      import('./usernotifications/usernotifications.module')
        .then(m => m.UsernotificationModule),
  },
  {
    path: 'invite-friend',
    loadChildren: () =>
      import('./userinvitefriends/userinvitefriends.module')
        .then(m => m.UserinvitefriendsModule),
  },
  {
    path: 'rewards',
    loadChildren: () =>
      import('./userrewards/userrewards.module')
        .then(m => m.UserrewardsModule),
  },
  {
    path: 'my-reviews',
    loadChildren: () =>
      import('./userreviews/userreviews.module')
        .then(m => m.UserreviewsModule),
  },
  {
    path: 'helpandsupport',
    loadChildren: () =>
      import('./userhelpsupport/userhelpsupport.module')
        .then(m => m.UserhelpsupportModule),
  },
  {
    path: 'myaccount',
    loadChildren: () =>
      import('./myaccount/myaccount.module')
        .then(m => m.MyaccountModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }

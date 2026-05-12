import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogRoutingModule } from './blog-routing.module';
import { BlogListingComponent } from '../bloglisting/bloglisting.component';
import { BlogDetailComponent } from '../blogdetails/blogdetails.component';

@NgModule({
  declarations: [
    BlogListingComponent,
    BlogDetailComponent
  ],
  imports: [
    CommonModule,
    BlogRoutingModule
  ]
})
export class BlogModule {}


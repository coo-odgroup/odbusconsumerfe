import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogListingComponent } from '../bloglisting/bloglisting.component';
import { BlogDetailComponent } from '../blogdetails/blogdetails.component';
import { BlogResolver } from '../blogdetails/blog.resolver';

const routes: Routes = [

  {
    path: '',
    component: BlogListingComponent
  },

  {
    path: 'category/:slug',
    component: BlogListingComponent
  },

  {
    path: 'tag/:tag_slug',
    component: BlogListingComponent
  },

  {
    path: 'author/:author_slug',
    component: BlogListingComponent
  },

  {
    path: ':category_slug/:slug',
    component: BlogDetailComponent,
    resolve: {
      blogData: BlogResolver
    }
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogRoutingModule { }


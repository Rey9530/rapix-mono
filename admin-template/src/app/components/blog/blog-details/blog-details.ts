import { Component } from '@angular/core';

import { blog, blogComments } from '../../../shared/data/blog';
import { SingleBlogDetails } from '../widgets/single-blog-details/single-blog-details';

@Component({
  selector: 'app-blog-details',
  imports: [SingleBlogDetails],
  templateUrl: './blog-details.html',
  styleUrl: './blog-details.scss',
})
export class BlogDetails {
  public blog = blog;
  public blogComment = blogComments;
}

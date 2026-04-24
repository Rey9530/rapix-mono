import { Component, input } from '@angular/core';

import { blog } from '../../../../shared/data/blog';
import { courseDetails } from '../../../../shared/data/courses';
import { IComments } from '../../../../shared/interface/courses';
import { CommentBlogDetails } from '../comment-blog-details/comment-blog-details';

@Component({
  selector: 'app-single-blog-details',
  imports: [CommentBlogDetails],
  templateUrl: './single-blog-details.html',
  styleUrl: './single-blog-details.scss',
})
export class SingleBlogDetails {
  readonly details = input(blog);
  readonly courseDetails = input(courseDetails);
  readonly comment = input<IComments[]>();
}

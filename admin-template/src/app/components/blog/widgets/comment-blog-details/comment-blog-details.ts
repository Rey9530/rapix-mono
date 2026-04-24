import { Component, input } from '@angular/core';

import { IComments } from '../../../../shared/interface/courses';

@Component({
  selector: 'app-comment-blog-details',
  imports: [],
  templateUrl: './comment-blog-details.html',
  styleUrl: './comment-blog-details.scss',
})
export class CommentBlogDetails {
  readonly comment = input<IComments[]>();
}

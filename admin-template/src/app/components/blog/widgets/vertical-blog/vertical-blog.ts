import { Component, input } from '@angular/core';

import { IBlogDetails } from '../../../../shared/interface/blog';

@Component({
  selector: 'app-vertical-blog',
  imports: [],
  templateUrl: './vertical-blog.html',
  styleUrl: './vertical-blog.scss',
})
export class VerticalBlog {
  readonly blog = input<IBlogDetails>();
}

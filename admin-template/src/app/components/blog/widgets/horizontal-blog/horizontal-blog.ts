import { Component, input } from '@angular/core';

import { IBlogDetails } from '../../../../shared/interface/blog';

@Component({
  selector: 'app-horizontal-blog',
  imports: [],
  templateUrl: './horizontal-blog.html',
  styleUrl: './horizontal-blog.scss',
})
export class HorizontalBlog {
  readonly blog = input<IBlogDetails>();
}

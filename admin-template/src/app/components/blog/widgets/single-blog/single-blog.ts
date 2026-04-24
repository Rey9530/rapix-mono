import { Component, input } from '@angular/core';

import { IBlogDetails } from '../../../../shared/interface/blog';

@Component({
  selector: 'app-single-blog',
  imports: [],
  templateUrl: './single-blog.html',
  styleUrl: './single-blog.scss',
})
export class SingleBlog {
  readonly blog = input<IBlogDetails>();
}

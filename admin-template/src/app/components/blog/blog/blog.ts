import { SlicePipe } from '@angular/common';
import { Component } from '@angular/core';

import { blogDetails } from '../../../shared/data/blog';
import { HorizontalBlog } from '../widgets/horizontal-blog/horizontal-blog';
import { SingleBlog } from '../widgets/single-blog/single-blog';
import { VerticalBlog } from '../widgets/vertical-blog/vertical-blog';

@Component({
  selector: 'app-blog',
  imports: [SingleBlog, VerticalBlog, HorizontalBlog, SlicePipe],
  templateUrl: './blog.html',
  styleUrl: './blog.scss',
})
export class Blog {
  public blogDetails = blogDetails;
}

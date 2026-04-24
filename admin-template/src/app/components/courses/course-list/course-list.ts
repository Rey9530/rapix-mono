import { SlicePipe } from '@angular/common';
import { Component } from '@angular/core';

import { courseList } from '../../../shared/data/courses';
import { HorizontalBlog } from '../../blog/widgets/horizontal-blog/horizontal-blog';
import { VerticalBlog } from '../../blog/widgets/vertical-blog/vertical-blog';
import { CourseFilter } from '../course-filter/course-filter';

@Component({
  selector: 'app-course-list',
  imports: [CourseFilter, VerticalBlog, HorizontalBlog, SlicePipe],
  templateUrl: './course-list.html',
  styleUrl: './course-list.scss',
})
export class CourseList {
  public courseList = courseList;
}

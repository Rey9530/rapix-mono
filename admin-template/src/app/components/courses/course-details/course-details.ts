import { Component } from '@angular/core';

import { corsesComments, courseDetails } from '../../../shared/data/courses';
import { SingleBlogDetails } from '../../blog/widgets/single-blog-details/single-blog-details';
import { CourseFilter } from '../course-filter/course-filter';

@Component({
  selector: 'app-course-details',
  imports: [CourseFilter, SingleBlogDetails],
  templateUrl: './course-details.html',
  styleUrl: './course-details.scss',
})
export class CourseDetails {
  public courseDetails = courseDetails;
  public corsesComments = corsesComments;
}

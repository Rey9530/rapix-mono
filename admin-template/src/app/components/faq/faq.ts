import { Component } from '@angular/core';

import { FaqQuestionAnswer } from './faq-question-answer/faq-question-answer';
import { CommonArticleVideo } from './widgets/common-article-video/common-article-video';
import { CommonFaqDetails } from './widgets/common-faq-details/common-faq-details';
import { CommonFeaturedTutorials } from './widgets/common-featured-tutorials/common-featured-tutorials';
import {
  faqArticlesAndVideos,
  faqDetails,
  faqFeaturedTutorial,
} from '../../shared/data/faq';

@Component({
  selector: 'app-faq',
  imports: [
    FaqQuestionAnswer,
    CommonFaqDetails,
    CommonFeaturedTutorials,
    CommonArticleVideo,
  ],
  templateUrl: './faq.html',
  styleUrl: './faq.scss',
})
export class Faq {
  public faqDetails = faqDetails;
  public faqFeaturedTutorial = faqFeaturedTutorial;
  public faqArticlesAndVideos = faqArticlesAndVideos;
}

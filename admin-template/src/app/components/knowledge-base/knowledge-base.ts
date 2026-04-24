import { Component } from '@angular/core';

import { BrowseArticleCategory } from './browse-article-category/browse-article-category';
import { KnowledgeBaseTopData } from './knowledge-base-top-data/knowledge-base-top-data';
import {
  articlesAndVideosDetails,
  featuredTutorialDetails,
} from '../../shared/data/knowledge-base';
import { CommonArticleVideo } from '../faq/widgets/common-article-video/common-article-video';
import { CommonFeaturedTutorials } from '../faq/widgets/common-featured-tutorials/common-featured-tutorials';

@Component({
  selector: 'app-knowledge-base',
  imports: [
    KnowledgeBaseTopData,
    BrowseArticleCategory,
    CommonFeaturedTutorials,
    CommonArticleVideo,
  ],
  templateUrl: './knowledge-base.html',
  styleUrl: './knowledge-base.scss',
})
export class KnowledgeBase {
  public featuredTutorialDetails = featuredTutorialDetails;
  public articlesAndVideosDetails = articlesAndVideosDetails;
}

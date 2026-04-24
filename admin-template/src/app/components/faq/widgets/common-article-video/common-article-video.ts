import { Component, input } from '@angular/core';

import { FeatherIcon } from '../../../../shared/components/ui/feather-icon/feather-icon';
import { articlesAndVideosDetails } from '../../../../shared/data/knowledge-base';

@Component({
  selector: 'app-common-article-video',
  imports: [FeatherIcon],
  templateUrl: './common-article-video.html',
  styleUrl: './common-article-video.scss',
})
export class CommonArticleVideo {
  readonly details = input(articlesAndVideosDetails);
  readonly headerTitle = input<string>('');
  readonly faqClass = input<string>('');
}

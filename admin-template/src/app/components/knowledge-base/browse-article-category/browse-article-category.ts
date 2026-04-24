import { Component } from '@angular/core';

import { Card } from '../../../shared/components/ui/card/card';
import { FeatherIcon } from '../../../shared/components/ui/feather-icon/feather-icon';
import { browseArticles } from '../../../shared/data/knowledge-base';

@Component({
  selector: 'app-browse-article-category',
  imports: [FeatherIcon, Card],
  templateUrl: './browse-article-category.html',
  styleUrl: './browse-article-category.scss',
})
export class BrowseArticleCategory {
  public browseArticles = browseArticles;
}

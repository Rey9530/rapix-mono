import { Component } from '@angular/core';

import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { SearchResultAudio } from './search-result-audio/search-result-audio';
import { SearchResultSetting } from './search-result-setting/search-result-setting';
import { SearchResultVideo } from './search-result-video/search-result-video';
import { SearchResults } from './search-results/search-results';
import { searchResultTab } from '../../shared/data/search-result';
import { SocialAppPhotos } from '../social-app/widgets/social-app-photos/social-app-photos';

@Component({
  selector: 'app-search-result',
  imports: [
    NgbNavModule,
    SearchResults,
    SocialAppPhotos,
    SearchResultVideo,
    SearchResultAudio,
    SearchResultSetting,
  ],
  templateUrl: './search-result.html',
  styleUrl: './search-result.scss',
})
export class SearchResult {
  public searchResultTab = searchResultTab;
  public active: string = 'all';
}

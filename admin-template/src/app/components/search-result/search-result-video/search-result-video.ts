import { Component, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { videos } from '../../../shared/data/search-result';
import { Pagination } from '../pagination/pagination';

@Component({
  selector: 'app-search-result-video',
  imports: [Pagination],
  templateUrl: './search-result-video.html',
  styleUrl: './search-result-video.scss',
})
export class SearchResultVideo {
  sanitizer = inject(DomSanitizer);

  public videos = videos;

  public safeVideos: {
    id: number;
    title: string;
    url: SafeResourceUrl;
    rating: number;
    votes: number;
    type: string;
  }[] = [];

  constructor() {
    this.preprocessUrls();
  }

  preprocessUrls() {
    this.safeVideos = this.videos.map((video) => ({
      ...video,
      url: this.sanitizer.bypassSecurityTrustResourceUrl(video.url),
    }));
  }
}

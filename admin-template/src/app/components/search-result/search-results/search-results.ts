import { SlicePipe, NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';

import { blogDetails } from '../../../shared/data/blog';
import { audios, themes, videos } from '../../../shared/data/search-result';
import { IAudio } from '../../../shared/interface/search-result';
import { Pagination } from '../pagination/pagination';

@Component({
  selector: 'app-search-results',
  imports: [NgbRatingModule, SlicePipe, Pagination, NgClass, SlicePipe],
  templateUrl: './search-results.html',
  styleUrl: './search-results.scss',
})
export class SearchResults {
  sanitizer = inject(DomSanitizer);

  public themes = themes;
  public blogDetails = blogDetails[0];
  public audios = audios;
  public videos = videos;

  getAudios() {
    return this.audios.filter((audio) => audio.is_top_rated);
  }

  playAudio(audio: IAudio) {
    if (!audio.is_play) {
      this.audios.forEach((audios) => {
        if (this.audios.includes(audio)) {
          audios.is_play = false;
        }
      });
    }
    audio.is_play = !audio.is_play;
  }

  safe(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

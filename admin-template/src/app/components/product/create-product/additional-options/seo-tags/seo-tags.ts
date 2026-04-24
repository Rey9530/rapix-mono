import { Component, input, output } from '@angular/core';

import { AngularEditorModule } from '@kolkov/angular-editor';

import { SvgIcon } from '../../../../../shared/components/ui/svg-icon/svg-icon';

@Component({
  selector: 'app-seo-tags',
  imports: [AngularEditorModule, SvgIcon],
  templateUrl: './seo-tags.html',
  styleUrl: './seo-tags.scss',
})
export class SeoTags {
  readonly additionalActiveId = input<number>(0);
  readonly changeTabDetails = output<number>();

  next() {
    const nextId = this.additionalActiveId() + 1;
    this.changeTabDetails.emit(nextId);
  }

  previous() {
    const prevId = this.additionalActiveId() - 1;
    this.changeTabDetails.emit(prevId);
  }
}

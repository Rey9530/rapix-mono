import { NgClass, TitleCasePipe } from '@angular/common';
import { Component, input } from '@angular/core';

import { FeatherIcon } from '../../../../../shared/components/ui/feather-icon/feather-icon';

@Component({
  selector: 'app-variation-badge',
  imports: [FeatherIcon, NgClass, TitleCasePipe],
  templateUrl: './variation-badge.html',
  styleUrl: './variation-badge.scss',
})
export class VariationBadge {
  readonly badgeDetails = input<
    {
      color: string;
    }[]
  >();
  readonly type = input<string>('');
  readonly rounded = input<boolean>(false);
  readonly badgeIcons = input<
    {
      icon: string;
    }[]
  >();
}

import { Component } from '@angular/core';

import { BackgroundColorOpacity } from './widgets/background-color-opacity/background-color-opacity';
import { BorderOpacity } from './widgets/border-opacity/border-opacity';
import { CommonLinks } from './widgets/common-links/common-links';
import { LinkUnderlines } from './widgets/link-underlines/link-underlines';
import { LinkUtilities } from './widgets/link-utilities/link-utilities';

@Component({
  selector: 'app-navigate-links',
  imports: [
    LinkUtilities,
    LinkUnderlines,
    BorderOpacity,
    BackgroundColorOpacity,
    CommonLinks,
  ],
  templateUrl: './navigate-links.html',
  styleUrl: './navigate-links.scss',
})
export class NavigateLinks {}

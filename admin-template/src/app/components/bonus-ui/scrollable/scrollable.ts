import { Component } from '@angular/core';

import { BadgeScrollbar } from './widgets/badge-scrollbar/badge-scrollbar';
import { BothSideScrollbar } from './widgets/both-side-scrollbar/both-side-scrollbar';
import { CustomScrollbar } from './widgets/custom-scrollbar/custom-scrollbar';
import { HorizontalScrollbar } from './widgets/horizontal-scrollbar/horizontal-scrollbar';
import { ProfileScrollbar } from './widgets/profile-scrollbar/profile-scrollbar';
import { ScrollbarContent } from './widgets/scrollbar-content/scrollbar-content';
import { SmallSizeScrollbar } from './widgets/small-size-scrollbar/small-size-scrollbar';

@Component({
  selector: 'app-scrollable',
  imports: [
    CustomScrollbar,
    SmallSizeScrollbar,
    BadgeScrollbar,
    ProfileScrollbar,
    ScrollbarContent,
    HorizontalScrollbar,
    BothSideScrollbar,
  ],
  templateUrl: './scrollable.html',
  styleUrl: './scrollable.scss',
})
export class Scrollable {}

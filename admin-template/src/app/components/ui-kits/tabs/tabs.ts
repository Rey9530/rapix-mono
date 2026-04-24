import { Component } from '@angular/core';

import { AnimatedTab } from './widgets/animated-tab/animated-tab';
import { ArrowTab } from './widgets/arrow-tab/arrow-tab';
import { BackgroundPillTab } from './widgets/background-pill-tab/background-pill-tab';
import { BorderTab } from './widgets/border-tab/border-tab';
import { BottomTab } from './widgets/bottom-tab/bottom-tab';
import { IconTab } from './widgets/icon-tab/icon-tab';
import { JustifyTab } from './widgets/justify-tab/justify-tab';
import { MaterialStyleLeftTab } from './widgets/material-style-left-tab/material-style-left-tab';
import { MaterialStyleTab } from './widgets/material-style-tab/material-style-tab';
import { PillsTab } from './widgets/pills-tab/pills-tab';
import { SimpleTab } from './widgets/simple-tab/simple-tab';
import { VerticalTab } from './widgets/vertical-tab/vertical-tab';

@Component({
  selector: 'app-tabs',
  imports: [
    SimpleTab,
    IconTab,
    VerticalTab,
    PillsTab,
    JustifyTab,
    MaterialStyleLeftTab,
    MaterialStyleTab,
    BorderTab,
    BackgroundPillTab,
    ArrowTab,
    BottomTab,
    AnimatedTab,
  ],
  templateUrl: './tabs.html',
  styleUrl: './tabs.scss',
})
export class Tabs {}

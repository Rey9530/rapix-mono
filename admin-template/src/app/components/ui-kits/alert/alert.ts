import { Component } from '@angular/core';

import { AdditionalContent } from './widgets/additional-content/additional-content';
import { AlertsIcon } from './widgets/alerts-icon/alerts-icon';
import { CustomAlert } from './widgets/custom-alert/custom-alert';
import { DismissDarkAlert } from './widgets/dismiss-dark-alert/dismiss-dark-alert';
import { DismissLightAlert } from './widgets/dismiss-light-alert/dismiss-light-alert';
import { IconAlert } from './widgets/icon-alert/icon-alert';
import { LeftBorderAlert } from './widgets/left-border-alert/left-border-alert';
import { LinkDarkTheme } from './widgets/link-dark-theme/link-dark-theme';
import { LinkLightTheme } from './widgets/link-light-theme/link-light-theme';
import { LiveAlert } from './widgets/live-alert/live-alert';
import { OutlineDarkLightAlert } from './widgets/outline-dark-light-alert/outline-dark-light-alert';

@Component({
  selector: 'app-alert',
  imports: [
    LinkLightTheme,
    LinkDarkTheme,
    OutlineDarkLightAlert,
    AlertsIcon,
    LiveAlert,
    DismissLightAlert,
    DismissDarkAlert,
    LeftBorderAlert,
    CustomAlert,
    IconAlert,
    AdditionalContent,
  ],
  templateUrl: './alert.html',
  styleUrl: './alert.scss',
})
export class Alert {}

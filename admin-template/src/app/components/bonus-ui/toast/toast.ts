import { Component } from '@angular/core';

import { ColorSchemeToast } from './widgets/color-scheme-toast/color-scheme-toast';
import { DefaultToast } from './widgets/default-toast/default-toast';
import { LiveToast } from './widgets/live-toast/live-toast';
import { MessageToast } from './widgets/message-toast/message-toast';
import { StackingToast } from './widgets/stacking-toast/stacking-toast';
import { ToastPlacement } from './widgets/toast-placement/toast-placement';
import { TranslucentToast } from './widgets/translucent-toast/translucent-toast';
import { UniqueToast } from './widgets/unique-toast/unique-toast';

@Component({
  selector: 'app-toast',
  imports: [
    MessageToast,
    LiveToast,
    ColorSchemeToast,
    StackingToast,
    TranslucentToast,
    DefaultToast,
    UniqueToast,
    ToastPlacement,
  ],
  templateUrl: './toast.html',
  styleUrl: './toast.scss',
})
export class Toast {}

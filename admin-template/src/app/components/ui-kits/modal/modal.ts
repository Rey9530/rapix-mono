import { Component } from '@angular/core';

import { BasicModals } from './basic-modals/basic-modals';
import { CenteredModal } from './centered-modal/centered-modal';
import { CubaCustomModals } from './cuba-custom-modals/cuba-custom-modals';
import { FullScreenModals } from './full-screen-modals/full-screen-modals';
import { GridModal } from './grid-modal/grid-modal';
import { ScrollingLongContentModal } from './scrolling-long-content-modal/scrolling-long-content-modal';
import { SizesModals } from './sizes-modals/sizes-modals';
import { StaticBackdropModal } from './static-backdrop-modal/static-backdrop-modal';
import { ToggleBetweenModal } from './toggle-between-modal/toggle-between-modal';

@Component({
  selector: 'app-modal',
  imports: [
    BasicModals,
    SizesModals,
    FullScreenModals,
    CenteredModal,
    ToggleBetweenModal,
    StaticBackdropModal,
    GridModal,
    ScrollingLongContentModal,
    CubaCustomModals,
  ],
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
})
export class Modal {}

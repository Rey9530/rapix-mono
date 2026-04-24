import { Component } from '@angular/core';

import { ColoredBreadcrumb } from './widgets/colored-breadcrumb/colored-breadcrumb';
import { DefaultBreadcrumb } from './widgets/default-breadcrumb/default-breadcrumb';
import { DividerBreadcrumb } from './widgets/divider-breadcrumb/divider-breadcrumb';
import { IconBreadcrumb } from './widgets/icon-breadcrumb/icon-breadcrumb';
import { VariationBreadcrumb } from './widgets/variation-breadcrumb/variation-breadcrumb';

@Component({
  selector: 'app-breadcrumb',
  imports: [
    DefaultBreadcrumb,
    DividerBreadcrumb,
    IconBreadcrumb,
    VariationBreadcrumb,
    ColoredBreadcrumb,
  ],
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.scss',
})
export class Breadcrumb {}

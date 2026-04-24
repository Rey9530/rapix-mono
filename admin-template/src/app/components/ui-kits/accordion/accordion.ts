import { Component } from '@angular/core';

import { CollapseAccordion } from './widgets/collapse-accordion/collapse-accordion';
import { FlushAccordion } from './widgets/flush-accordion/flush-accordion';
import { HorizontalAccordion } from './widgets/horizontal-accordion/horizontal-accordion';
import { IconAccordion } from './widgets/icon-accordion/icon-accordion';
import { MultipleCollapseAccordion } from './widgets/multiple-collapse-accordion/multiple-collapse-accordion';
import { OutlineAccordion } from './widgets/outline-accordion/outline-accordion';
import { SimpleAccordion } from './widgets/simple-accordion/simple-accordion';

@Component({
  selector: 'app-accordion',
  imports: [
    SimpleAccordion,
    FlushAccordion,
    MultipleCollapseAccordion,
    IconAccordion,
    OutlineAccordion,
    HorizontalAccordion,
    CollapseAccordion,
  ],
  templateUrl: './accordion.html',
  styleUrl: './accordion.scss',
})
export class Accordion {}

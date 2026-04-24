import { Component } from '@angular/core';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-justify-contents',
  imports: [NgbDropdownModule, Card],
  templateUrl: './justify-contents.html',
  styleUrl: './justify-contents.scss',
})
export class JustifyContents {}

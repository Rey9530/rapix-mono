import { Component } from '@angular/core';

import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-multiple-bar',
  imports: [NgbProgressbarModule, Card],
  templateUrl: './multiple-bar.html',
  styleUrl: './multiple-bar.scss',
})
export class MultipleBar {}

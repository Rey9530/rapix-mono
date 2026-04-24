import { Component } from '@angular/core';

import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-progressbar',
  imports: [NgbProgressbarModule, Card],
  templateUrl: './progressbar.html',
  styleUrl: './progressbar.scss',
})
export class Progressbar {}

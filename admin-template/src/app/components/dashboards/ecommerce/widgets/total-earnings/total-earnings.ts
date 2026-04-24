import { DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-total-earnings',
  imports: [RouterModule, Card, DecimalPipe],
  templateUrl: './total-earnings.html',
  styleUrl: './total-earnings.scss',
})
export class TotalEarnings {}

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Card } from '../../../../../shared/components/ui/card/card';
import { SvgIcon } from '../../../../../shared/components/ui/svg-icon/svg-icon';

@Component({
  selector: 'app-advertisement',
  imports: [RouterModule, Card, SvgIcon],
  templateUrl: './advertisement.html',
  styleUrl: './advertisement.scss',
})
export class Advertisement {}

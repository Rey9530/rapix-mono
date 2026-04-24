import { Component } from '@angular/core';

import { BlockLoading } from './widgets/block-loading/block-loading';
import { CardLoading } from './widgets/card-loading/card-loading';
import { FormLoading } from './widgets/form-loading/form-loading';

@Component({
  selector: 'app-block-ui',
  imports: [BlockLoading, CardLoading, FormLoading],
  templateUrl: './block-ui.html',
  styleUrl: './block-ui.scss',
})
export class BlockUi {}

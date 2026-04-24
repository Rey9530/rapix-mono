import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { customContent } from '../../../../../shared/data/ui-kits/lists';

@Component({
  selector: 'app-custom-content-list',
  imports: [Card, NgClass],
  templateUrl: './custom-content-list.html',
  styleUrl: './custom-content-list.scss',
})
export class CustomContentList {
  public customContent = customContent;
}

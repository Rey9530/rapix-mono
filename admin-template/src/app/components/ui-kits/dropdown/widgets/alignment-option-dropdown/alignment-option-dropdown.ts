import { Component, HostListener } from '@angular/core';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-alignment-option-dropdown',
  imports: [NgbDropdownModule, Card],
  templateUrl: './alignment-option-dropdown.html',
  styleUrl: './alignment-option-dropdown.scss',
})
export class AlignmentOptionDropdown {
  public dropdownPlacementOne: string = 'bottom-right';
  public dropdownPlacementTwo: string = 'bottom-right';

  constructor() {
    this.getPosition();
  }

  @HostListener('window:resize')
  onResize() {
    this.getPosition();
  }

  getPosition() {
    this.dropdownPlacementOne =
      window.innerWidth > 1200 ? 'bottom-right' : 'bottom-left';
    this.dropdownPlacementTwo =
      window.innerWidth > 1200 ? 'bottom-left' : 'bottom-right';
  }
}

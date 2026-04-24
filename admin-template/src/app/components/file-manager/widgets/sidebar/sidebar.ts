import { Component } from '@angular/core';

import { Card } from '../../../../shared/components/ui/card/card';
import { FeatherIcon } from '../../../../shared/components/ui/feather-icon/feather-icon';
import { SvgIcon } from '../../../../shared/components/ui/svg-icon/svg-icon';
import { fileTypes, pricingPlan } from '../../../../shared/data/fileManager';

@Component({
  selector: 'app-sidebar',
  imports: [Card, SvgIcon, FeatherIcon],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  public fileTypes = fileTypes;
  public pricingPlan = pricingPlan;
  public sidebarOpen: boolean = false;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}

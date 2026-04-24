import { Component } from '@angular/core';

import { FeatherIcon } from '../../../../shared/components/ui/feather-icon/feather-icon';
import { sidebar } from '../../../../shared/data/todo';
import { user } from '../../../../shared/data/user';

@Component({
  selector: 'app-sidebar',
  imports: [FeatherIcon],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  public sidebar = sidebar;
  public userDetails = user;
  public sidebarOpen: boolean = false;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}

import { Component, output, input, inject } from '@angular/core';

import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { FeatherIcon } from '../../../../shared/components/ui/feather-icon/feather-icon';
import { SvgIcon } from '../../../../shared/components/ui/svg-icon/svg-icon';
import { contacts } from '../../../../shared/data/chat';
import { todoListColors } from '../../../../shared/data/project';
import { IContact, IRecentChats } from '../../../../shared/interface/chat';
import { ChatService } from '../../../../shared/services/chat.service';

@Component({
  selector: 'app-sidebar',
  imports: [NgbNavModule, NgbDropdownModule, FeatherIcon, SvgIcon],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  chatService = inject(ChatService);

  readonly currentUserChat = output<IRecentChats>();
  readonly recentChats = input<IRecentChats[]>();
  readonly groupChat = input<boolean>(false);
  readonly activeId = input<number>(2);

  public activeTab = 'chats';
  public activeChat = 2;
  public contacts = contacts;
  public colors = todoListColors;

  ngOnInit(): void {
    this.currentUserChat.emit(this.getCurrentUserChat()!);
  }

  ngOnChanges() {
    const activeId = this.activeId();
    if (activeId) {
      this.activeChat = activeId;
    }
  }

  handleChat(chat: IRecentChats) {
    this.activeChat = chat.id;
    this.currentUserChat.emit(this.getCurrentUserChat()!);
  }

  getCurrentUserChat() {
    return this.recentChats()?.find((chat) => chat.id == this.activeChat);
  }

  objectKeys(obj: Record<string, unknown>): string[] {
    return Object.keys(obj);
  }

  getContactGroup(): Record<string, IContact[]> {
    const groups: Record<string, IContact[]> = {};

    this.contacts.forEach((contact) => {
      let firstLetter = contact.user_name.charAt(0).toUpperCase();

      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }

      groups[firstLetter].push(contact);
    });

    return Object.keys(groups)
      .sort()
      .reduce((sortedGroups: Record<string, IContact[]>, key) => {
        sortedGroups[key] = groups[key].sort((a, b) =>
          a.user_name.localeCompare(b.user_name),
        );
        return sortedGroups;
      }, {});
  }
}

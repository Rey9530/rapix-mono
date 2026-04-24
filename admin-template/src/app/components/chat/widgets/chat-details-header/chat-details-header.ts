import { Component, inject, input } from '@angular/core';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { SvgIcon } from '../../../../shared/components/ui/svg-icon/svg-icon';
import { IRecentChats } from '../../../../shared/interface/chat';
import { ChatService } from '../../../../shared/services/chat.service';

@Component({
  selector: 'app-chat-details-header',
  imports: [NgbDropdownModule, SvgIcon],
  templateUrl: './chat-details-header.html',
  styleUrl: './chat-details-header.scss',
})
export class ChatDetailsHeader {
  chatService = inject(ChatService);

  readonly currentUserChat = input<IRecentChats>();

  readonly groupChat = input<boolean>(false);
}

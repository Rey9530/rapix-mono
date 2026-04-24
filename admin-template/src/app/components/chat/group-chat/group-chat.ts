import { NgClass } from '@angular/common';
import { Component, ElementRef, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { SvgIcon } from '../../../shared/components/ui/svg-icon/svg-icon';
import { groupChats, randomChats } from '../../../shared/data/chat';
import { user } from '../../../shared/data/user';
import { IGroupMembers, IRecentChats } from '../../../shared/interface/chat';
import { ChatDetailsHeader } from '../widgets/chat-details-header/chat-details-header';
import { Sidebar } from '../widgets/sidebar/sidebar';

@Component({
  selector: 'app-group-chat',
  imports: [
    NgbDropdownModule,
    ReactiveFormsModule,
    Sidebar,
    ChatDetailsHeader,
    SvgIcon,
    NgClass,
  ],
  templateUrl: './group-chat.html',
  styleUrl: './group-chat.scss',
})
export class GroupChat {
  private readonly chatContainer = viewChild<ElementRef>('chat');

  public userDetails = user;
  public groupChats = groupChats;
  public currentUserChat: IRecentChats;
  public inputMessage: string = '';
  public chatForm = new FormGroup({
    inputMessage: new FormControl(''),
  });

  handleChat(chat: IRecentChats) {
    this.currentUserChat = chat;
  }

  getUserDetails() {
    if (this.currentUserChat.group_members) {
      const random =
        this.currentUserChat.group_members[
          Math.floor(Math.random() * this.currentUserChat.group_members.length)
        ];
      return random;
    }
  }

  handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.handleMessage();
    }
  }

  handleMessage() {
    if (this.chatForm.value.inputMessage) {
      if (!this.currentUserChat.chats) {
        this.currentUserChat.chats = [];
      }
      this.currentUserChat.chats?.push({
        chat: this.chatForm.value.inputMessage,
        is_reply: true,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
      });
      this.scrollToBottom();
      setTimeout(() => {
        this.getReply();
      }, 500);
    }

    this.chatForm.controls['inputMessage'].setValue('');

    setTimeout(() => {
      if (this.currentUserChat.chats && this.currentUserChat.chats.length) {
        this.currentUserChat.last_message =
          this.currentUserChat.chats[this.currentUserChat.chats.length - 1][
            'chat'
          ];
        this.currentUserChat.message_time =
          this.currentUserChat.chats[this.currentUserChat.chats.length - 1][
            'time'
          ];
      }
      this.scrollToBottom();
    }, 500);
  }

  getReply() {
    const randomReply =
      randomChats[Math.floor(Math.random() * randomChats.length)];

    let randomUser;

    if (this.currentUserChat.group_members) {
      const user =
        this.currentUserChat.group_members[
          Math.floor(Math.random() * randomChats.length)
        ];
      if (user) {
        randomUser = user.user_name;
      }
    }

    this.currentUserChat.chats?.push({
      chat: randomReply,
      is_reply: false,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
      user_name: randomUser,
    });
  }

  getUserProfile(members?: IGroupMembers[], name?: string) {
    if (name && members) {
      const currentMember = members.find((user) => user.user_name === name);
      if (currentMember) {
        return currentMember?.user_profile;
      }
    }
  }

  private scrollToBottom() {
    setTimeout(() => {
      const chatContainer = this.chatContainer();
      if (chatContainer) {
        chatContainer.nativeElement.scrollTo({
          top: chatContainer.nativeElement.scrollHeight,
          behavior: 'smooth',
        });
      }
    }, 100);
  }
}

import { NgClass } from '@angular/common';
import { Component, ElementRef, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { SvgIcon } from '../../../shared/components/ui/svg-icon/svg-icon';
import { randomChats, recentChats } from '../../../shared/data/chat';
import { user } from '../../../shared/data/user';
import { IRecentChats } from '../../../shared/interface/chat';
import { ChatDetailsHeader } from '../widgets/chat-details-header/chat-details-header';
import { Sidebar } from '../widgets/sidebar/sidebar';

@Component({
  selector: 'app-private-chat',
  imports: [
    NgbDropdownModule,
    ReactiveFormsModule,
    Sidebar,
    ChatDetailsHeader,
    SvgIcon,
    NgClass,
  ],
  templateUrl: './private-chat.html',
  styleUrl: './private-chat.scss',
})
export class PrivateChat {
  private readonly chatContainer = viewChild<ElementRef>('chat');

  public userDetails = user;
  public recentChats = recentChats;
  public currentUserChat: IRecentChats;
  public inputMessage: string = '';
  public chatForm = new FormGroup({
    inputMessage: new FormControl(''),
  });

  ngOnInit() {
    setInterval(() => {
      this.recentChats.forEach((chat) => {
        if (chat?.message_time && chat.chats && chat.chats.length) {
          if (this.getDifferenceFromNow(chat.message_time) == 'Online') {
            chat.user_status = this.getDifferenceFromNow(chat.message_time);
          } else {
            chat.user_status = 'Offline';
            chat.last_seen = this.getDifferenceFromNow(chat.message_time);
          }
        }
      });
    }, 60000); // 60000ms = 1 minute
  }

  getDifferenceFromNow(timeStr: string): string {
    const now = new Date();
    const messageTime = new Date(`${now.toDateString()} ${timeStr}`);
    const diffMs = now.getTime() - messageTime.getTime();
    const diffMin = diffMs / (1000 * 60);

    if (diffMin <= 5) {
      return 'Online';
    } else if (diffMin > 5 && diffMin <= 60) {
      return `${Math.floor(diffMin)} min ago`;
    } else {
      return 'Offline';
    }
  }

  handleChat(chat: IRecentChats) {
    this.currentUserChat = chat;
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
        this.currentUserChat.user_status = 'Online';
      }
      this.scrollToBottom();
    }, 500);
  }

  getReply() {
    const randomReply =
      randomChats[Math.floor(Math.random() * randomChats.length)];

    this.currentUserChat.chats?.push({
      chat: randomReply,
      is_reply: false,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
    });
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

import { Component, output, inject, viewChild } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../shared/components/ui/card/card';
import { FeatherIcon } from '../../../../shared/components/ui/feather-icon/feather-icon';
import { bookmarkFilter, bookmarkTags } from '../../../../shared/data/bookmark';
import { user } from '../../../../shared/data/user';
import { IBookmark } from '../../../../shared/interface/bookmark';
import { ITabs } from '../../../../shared/interface/common';
import { BookmarkModal } from '../bookmark-modal/bookmark-modal';
import { TagModal } from '../tag-modal/tag-modal';

@Component({
  selector: 'app-sidebar',
  imports: [Card, FeatherIcon, BookmarkModal, TagModal],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  private modal = inject(NgbModal);

  readonly BookmarkModal = viewChild<BookmarkModal>('bookmarkModal');
  readonly TagModal = viewChild<TagModal>('tagModal');

  readonly currentTab = output<ITabs>();
  readonly newBookmark = output<IBookmark>();

  public bookmarkFilter = bookmarkFilter;
  public bookmarkTags = bookmarkTags;
  public userDetails = user;
  public filterOpen: boolean = false;

  public activeTab = this.bookmarkFilter[0];

  ngOnInit() {
    this.currentTab.emit(this.activeTab);
  }

  handleTab(item: ITabs) {
    this.activeTab = item;
    this.currentTab.emit(this.activeTab);
  }

  addBookmark() {
    this.modal.open(BookmarkModal, { size: 'lg' });
  }

  handleAddBookmark(bookmark: IBookmark) {
    this.newBookmark.emit(bookmark);
  }

  toggleFilter() {
    this.filterOpen = !this.filterOpen;
  }
}

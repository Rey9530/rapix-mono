import { Component, inject, viewChild } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { bookmarks } from './../../shared/data/bookmark';
import { BookmarkModal } from './widgets/bookmark-modal/bookmark-modal';
import { Sidebar } from './widgets/sidebar/sidebar';
import { FeatherIcon } from '../../shared/components/ui/feather-icon/feather-icon';
import { IBookmark } from '../../shared/interface/bookmark';
import { ITabs } from '../../shared/interface/common';

@Component({
  selector: 'app-bookmark',
  imports: [Sidebar, FeatherIcon, BookmarkModal],
  templateUrl: './bookmark.html',
  styleUrl: './bookmark.scss',
})
export class Bookmark {
  private modal = inject(NgbModal);

  readonly BookmarkModal = viewChild<BookmarkModal>('bookmarkModal');

  public activeTab: ITabs;
  public bookmarks = bookmarks;
  public isListView: boolean = false;

  handleCurrentTab(value: ITabs) {
    this.activeTab = value;
  }

  getFilteredBookmark() {
    if (this.activeTab.value == 'created_by_me') {
      return this.bookmarks;
    }
    if (this.activeTab.value == 'favorites') {
      return this.bookmarks.filter((bookmark) => bookmark.is_favorite);
    }
  }

  favoriteBookmark(bookmark: IBookmark) {
    bookmark.is_favorite = !bookmark.is_favorite;
  }

  editBookmark(bookmark: IBookmark) {
    const modalRef = this.modal.open(BookmarkModal, { size: 'lg' });
    modalRef.componentInstance.bookmarkDetails = bookmark;
  }

  deleteBookmark(bookmark: IBookmark) {
    this.bookmarks = this.bookmarks.filter(
      (bookmarks) => bookmarks.id !== bookmark.id,
    );
  }

  handleAddBookmark(bookmark: IBookmark) {
    this.bookmarks.push(bookmark);
  }

  toggleListView(value: boolean) {
    this.isListView = value;
  }
}

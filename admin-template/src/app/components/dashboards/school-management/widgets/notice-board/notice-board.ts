import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { cardToggleOptions3 } from '../../../../../shared/data/common';
import { noticeBoard } from '../../../../../shared/data/dashboard/school-management';

@Component({
  selector: 'app-notice-board',
  imports: [Card],
  templateUrl: './notice-board.html',
  styleUrl: './notice-board.scss',
})
export class NoticeBoard {
  public noticeBoard = noticeBoard;
  public cardToggleOption = cardToggleOptions3;
}

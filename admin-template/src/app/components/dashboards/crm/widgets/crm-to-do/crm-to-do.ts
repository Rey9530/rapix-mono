import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Card } from '../../../../../shared/components/ui/card/card';
import { CardDropdownButton } from '../../../../../shared/components/ui/card/card-dropdown-button/card-dropdown-button';
import { cardToggleOptions3 } from '../../../../../shared/data/common';
import { crmTodo } from '../../../../../shared/data/dashboard/crm';
import { todoListColors } from '../../../../../shared/data/project';

@Component({
  selector: 'app-crm-to-do',
  imports: [Card, CardDropdownButton, RouterModule],
  templateUrl: './crm-to-do.html',
  styleUrl: './crm-to-do.scss',
})
export class CrmToDo {
  public crmTodo = crmTodo;
  public cardToggleOption = cardToggleOptions3;
  public colors = todoListColors;

  getColor(index: number) {
    return this.colors[index % this.colors.length];
  }
}

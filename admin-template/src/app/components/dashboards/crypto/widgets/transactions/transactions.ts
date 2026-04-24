import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { FeatherIcon } from '../../../../../shared/components/ui/feather-icon/feather-icon';
import {
  transactions,
  transactionTab,
} from '../../../../../shared/data/dashboard/crypto';
import { ITransactions } from '../../../../../shared/interface/dashboard/crypto';

@Component({
  selector: 'app-transactions',
  imports: [Card, FeatherIcon, NgClass],
  templateUrl: './transactions.html',
  styleUrl: './transactions.scss',
})
export class Transactions {
  public activeTab: string = 'all';
  public transactionTab = transactionTab;
  public transactions = transactions;
  public filteredTransaction: ITransactions[];

  constructor() {
    this.filterTransaction(this.activeTab);
  }

  changeTab(value: string) {
    this.activeTab = value;

    this.filterTransaction(this.activeTab);
  }

  filterTransaction(value: string) {
    this.filteredTransaction = this.transactions.filter((transaction) => {
      if (value == 'all') {
        return true;
      } else if (transaction.type == value) {
        return transaction;
      }
    });
  }
}

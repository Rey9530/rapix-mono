import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

import { CrmToDo } from './widgets/crm-to-do/crm-to-do';
import { Deals } from './widgets/deals/deals';
import { FinanceOverview } from './widgets/finance-overview/finance-overview';
import { LeadSource } from './widgets/lead-source/lead-source';
import { Leads } from './widgets/leads/leads';
import { PipelineBreakdown } from './widgets/pipeline-breakdown/pipeline-breakdown';
import { RevenueGrowth } from './widgets/revenue-growth/revenue-growth';
import { SalesChart } from './widgets/sales-chart/sales-chart';
import { SalesWeek } from './widgets/sales-week/sales-week';
import { TotalSales } from './widgets/total-sales/total-sales';
import { UpgradePlan } from './widgets/upgrade-plan/upgrade-plan';
import { lastMonthDetails } from '../../../shared/data/widgets/general';
import { LastMonthDetails } from '../../widgets/general/widgets/last-month-details/last-month-details';

@Component({
  selector: 'app-crm',
  imports: [
    LastMonthDetails,
    TotalSales,
    UpgradePlan,
    SalesChart,
    RevenueGrowth,
    PipelineBreakdown,
    CrmToDo,
    FinanceOverview,
    Deals,
    Leads,
    SalesWeek,
    LeadSource,
    NgClass,
  ],
  templateUrl: './crm.html',
  styleUrl: './crm.scss',
})
export class Crm {
  public lastMonthDetails = lastMonthDetails;
}

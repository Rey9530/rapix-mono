import { Component } from '@angular/core';

import { FeatherIcon } from '../../../shared/components/ui/feather-icon/feather-icon';
import { knowledgeBase } from '../../../shared/data/knowledge-base';
import { CommonFaqDetails } from '../../faq/widgets/common-faq-details/common-faq-details';

@Component({
  selector: 'app-knowledge-base-top-data',
  imports: [FeatherIcon, CommonFaqDetails],
  templateUrl: './knowledge-base-top-data.html',
  styleUrl: './knowledge-base-top-data.scss',
})
export class KnowledgeBaseTopData {
  public knowledgeBase = knowledgeBase;
}

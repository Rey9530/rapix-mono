import { Component } from '@angular/core';

import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

import { FaqLatestUpdates } from './faq-latest-updates/faq-latest-updates';
import { FaqNavigation } from './faq-navigation/faq-navigation';
import { FaqSearchArticles } from './faq-search-articles/faq-search-articles';
import { FeatherIcon } from '../../../shared/components/ui/feather-icon/feather-icon';
import { faqQuestionAnswer } from '../../../shared/data/faq';

@Component({
  selector: 'app-faq-question-answer',
  imports: [
    NgbAccordionModule,
    FaqSearchArticles,
    FaqNavigation,
    FaqLatestUpdates,
    FeatherIcon,
  ],
  templateUrl: './faq-question-answer.html',
  styleUrl: './faq-question-answer.scss',
})
export class FaqQuestionAnswer {
  public faqQuestionAnswer = faqQuestionAnswer;
}

import { Component, OnInit } from '@angular/core';

interface FaqItem {
  question: string;
  answer: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-common-content',
  templateUrl: './common-content.component.html',
  styleUrls: ['./common-content.component.css']
})
export class CommonContentComponent implements OnInit {

  faqs: FaqItem[] = [];

  constructor() { }

  ngOnInit(): void {
    this.faqs = [
      {
        question: 'How do I opt-in for free cancellation for my booking?',
        answer: 'Customers can purchase free cancellation for their booking by selecting yes on Free Cancellation section on the customer info screen.',
        isOpen: true   // first one open by default
      },
      {
        question: 'Can I cancel the free cancellation after purchasing it?',
        answer: 'No, once purchased, free cancellation cannot be cancelled separately.',
        isOpen: false
      },
      {
        question: 'What happens to my free cancellation if I reschedule my booking?',
        answer: 'Free cancellation may not be applicable after rescheduling depending on the policy.',
        isOpen: false
      },
      {
        question: 'Why am I still getting cancellation charges even though I have purchased free cancellation?',
        answer: 'This may happen if cancellation is done after the allowed time window.',
        isOpen: false
      },
      {
        question: 'Will my free cancellation be refunded when I cancel my ticket?',
        answer: 'The free cancellation charge itself is non-refundable.',
        isOpen: false
      },
      {
        question: 'Where will I get my refund on cancellation?',
        answer: 'Refund will be credited to the original payment method used during booking.',
        isOpen: false
      }
    ];
  }

  toggleFaq(index: number): void {
    this.faqs.forEach((faq, i) => {
      faq.isOpen = i === index ? !faq.isOpen : false;
    });
  }
}
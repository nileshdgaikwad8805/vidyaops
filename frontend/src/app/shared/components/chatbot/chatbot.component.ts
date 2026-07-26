import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ChatMessage, LeadCaptureData } from '../../../core/models/site.models';
import { ChatbotService } from '../../../core/services/chatbot.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.scss'
})
export class ChatbotComponent {
  private readonly chatbotService = inject(ChatbotService);

  readonly isOpen = signal(false);
  readonly draft = signal('');
  readonly messages = signal<Array<{ sender: 'bot' | 'user'; text: string }>>([
    {
      sender: 'bot',
      text: 'Hi! I am VidyaOps AI assistant. I can help you with:\n\n• Training programs & certifications\n• Free & paid workshops\n• Corporate training\n• Pricing & scheduling\n• Contact information\n\nWhat would you like to know?',
    },
  ]);
  readonly isLoading = signal(false);

  private readonly leadSteps: Array<keyof LeadCaptureData> = ['name', 'contact', 'learnerType', 'interest'];
  private readonly leadPrompts: Record<keyof LeadCaptureData, string> = {
    name: 'Great! What is your name?',
    contact: 'How should VidyaOps contact you? Share your phone number or email.',
    learnerType: 'Are you a college student, fresher, early professional, or knowledge seeker?',
    interest: 'Which area are you most interested in: Cloud, Data Analysis, AI, Cybersecurity, Free Workshop, or Paid Workshop?',
  };
  private readonly counselorPrompts = [
    'I can guide you like a VidyaOps counselor. I will ask 3 quick questions, then recommend the best starting path.\n\nFirst, are you a college student, fresher, early professional, working professional, or part of a team/institution?',
    'Which area are you most interested in: Cloud, Data Analysis, AI, Cybersecurity, Software Development, or workshops in general?',
    'What is your main goal right now: explore a topic, build practical skills, prepare for a career start, earn a certification, or choose the right first step?',
  ];
  private readonly highIntentPatterns = [
    'enroll', 'join', 'register', 'book', 'call me', 'contact me', 'interested',
    'sign up', 'start', 'begin', 'apply', 'admission', 'admissions',
  ];
  private readonly counselorPatterns = [
    'which course', 'which program', 'help me choose', 'recommend', 'suggest',
    'best path', 'what should i', 'guide me', 'confused', 'not sure',
    'what do you suggest', 'help me decide',
  ];

  private leadCaptureActive = false;
  private leadStepIndex = 0;
  private counselorActive = false;
  private counselorStepIndex = 0;
  private readonly leadData: LeadCaptureData = {
    name: '',
    contact: '',
    learnerType: '',
    interest: '',
  };
  private readonly counselorAnswers = ['', '', ''];

  toggle(): void {
    this.isOpen.update((open) => !open);
  }

  close(): void {
    this.isOpen.set(false);
  }

  async sendMessage(): Promise<void> {
    const text = this.draft().trim();

    if (!text || this.isLoading()) {
      return;
    }

    this.pushMessage(text, 'user');
    this.draft.set('');

    if (this.leadCaptureActive) {
      await this.handleLeadStep(text);
      return;
    }

    if (this.counselorActive) {
      await this.handleCounselorStep(text);
      return;
    }

    const lower = text.toLowerCase();

    if (this.highIntentPatterns.some((pattern) => lower.includes(pattern))) {
      this.startLeadCapture();
      return;
    }

    if (this.counselorPatterns.some((pattern) => lower.includes(pattern))) {
      this.startCounselorFlow();
      return;
    }

    this.isLoading.set(true);

    try {
      const history: ChatMessage[] = this.messages().map((message) => ({
        role: message.sender === 'user' ? 'user' : 'assistant',
        content: message.text,
      }));
      const reply = await this.chatbotService.getReply(text, history);
      this.pushMessage(reply, 'bot');
    } finally {
      this.isLoading.set(false);
    }
  }

  private startLeadCapture(): void {
    this.leadCaptureActive = true;
    this.leadStepIndex = 0;
    this.pushMessage('I can help you get started! I will collect a few details so VidyaOps can guide you better.', 'bot');
    this.pushMessage(this.leadPrompts[this.leadSteps[this.leadStepIndex]], 'bot');
  }

  private async handleLeadStep(answer: string): Promise<void> {
    const step = this.leadSteps[this.leadStepIndex];
    this.leadData[step] = answer;
    this.leadStepIndex += 1;

    if (this.leadStepIndex >= this.leadSteps.length) {
      this.leadCaptureActive = false;
      await this.chatbotService.saveLead({ ...this.leadData });
      this.pushMessage(
        `Thanks ${this.leadData.name}! Your details are saved. Open the contact page to see them pre-filled, or continue on WhatsApp at +91 9503685152 for a faster reply.`,
        'bot',
      );
      return;
    }

    this.pushMessage(this.leadPrompts[this.leadSteps[this.leadStepIndex]], 'bot');
  }

  private startCounselorFlow(): void {
    this.counselorActive = true;
    this.counselorStepIndex = 0;
    this.pushMessage(this.counselorPrompts[this.counselorStepIndex], 'bot');
  }

  private async handleCounselorStep(answer: string): Promise<void> {
    this.counselorAnswers[this.counselorStepIndex] = answer;
    this.counselorStepIndex += 1;

    if (this.counselorStepIndex >= this.counselorPrompts.length) {
      this.counselorActive = false;
      this.isLoading.set(true);

      try {
        const reply = await this.chatbotService.getCounselorReply(
          this.counselorAnswers[0],
          this.counselorAnswers[1],
          this.counselorAnswers[2],
        );
        this.pushMessage(reply, 'bot');
      } finally {
        this.isLoading.set(false);
      }

      return;
    }

    this.pushMessage(this.counselorPrompts[this.counselorStepIndex], 'bot');
  }

  private pushMessage(text: string, sender: 'bot' | 'user'): void {
    this.messages.update((messages) => [...messages, { text, sender }]);
  }
}

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { ChatMessage, LeadCaptureData } from '../models/site.models';
import { RuntimeConfigService } from './runtime-config.service';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private readonly http = inject(HttpClient);
  private readonly runtimeConfig = inject(RuntimeConfigService);

  private readonly knowledgeBase: Record<string, string> = {
    contact: 'You can contact VidyaOps at 9503685152, email info@vidyaops.com, or use the WhatsApp button for a faster reply.',
    audience: 'VidyaOps is built for college students, freshers, early professionals, and knowledge seekers.',
    location: 'VidyaOps is based in Pune, Maharashtra, and serves learners globally.',
    services: 'VidyaOps offers Cloud, Data Analysis, AI, Cybersecurity, corporate training, and practical workshops.',
    workshops: 'VidyaOps runs both free and paid workshops. You can browse the workshops page or contact the team to know the next batch.',
    recommendation: 'If you are just starting, a free workshop is a strong first step. If you want deeper practice, a structured training program is a better fit.',
  };

  async getReply(message: string, history: ChatMessage[]): Promise<string> {
    if (this.runtimeConfig.isStaticRuntime) {
      return this.getLocalReply(message);
    }

    try {
      const payload = await firstValueFrom(
        this.http.post<{ reply?: string }>(this.runtimeConfig.apiUrl('/api/chat'), {
          sessionId: this.getSessionId(),
          message,
          messages: history,
        }),
      );

      return payload.reply || this.getLocalReply(message);
    } catch {
      return this.getLocalReply(message);
    }
  }

  async getCounselorReply(learnerType: string, interest: string, goal: string): Promise<string> {
    const localFallback = this.getLocalCounselorReply(learnerType, interest, goal);

    if (this.runtimeConfig.isStaticRuntime) {
      return localFallback;
    }

    try {
      const counselorPrompt =
        `Learner type: ${learnerType}\n` +
        `Interest area: ${interest}\n` +
        `Goal: ${goal}\n` +
        'Please recommend the best VidyaOps starting path.';

      const payload = await firstValueFrom(
        this.http.post<{ reply?: string }>(this.runtimeConfig.apiUrl('/api/chat'), {
          sessionId: this.getSessionId(),
          mode: 'counselor',
          message: counselorPrompt,
          messages: [{ role: 'user', content: counselorPrompt }],
        }),
      );

      return payload.reply || localFallback;
    } catch {
      return localFallback;
    }
  }

  async saveLead(lead: LeadCaptureData): Promise<void> {
    if (this.runtimeConfig.isStaticRuntime) {
      this.persistLead(lead);
      return;
    }

    try {
      await firstValueFrom(
        this.http.post(this.runtimeConfig.apiUrl('/api/leads'), {
          sessionId: this.getSessionId(),
          ...lead,
        }),
      );
    } finally {
      this.persistLead(lead);
    }
  }

  readPersistedLead(): LeadCaptureData | null {
    const raw = localStorage.getItem('vidyaops_lead_prefill');

    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as LeadCaptureData;
    } catch {
      return null;
    }
  }

  private getLocalReply(message: string): string {
    const lower = message.toLowerCase();

    if (lower.includes('cloud')) {
      return 'VidyaOps offers practical Cloud training for students, freshers, and early professionals with guided labs and clear next steps.';
    }

    if (lower.includes('data')) {
      return 'We offer Data Analysis training focused on practical understanding, guided tooling, and career-relevant exercises.';
    }

    if (lower.includes('ai')) {
      return 'VidyaOps provides AI training for learners who want practical exposure, responsible use cases, and structured learning support.';
    }

    if (lower.includes('cyber')) {
      return 'Our Cybersecurity training is built for learners who want a practical starting point and a clearer security career path.';
    }

    if (lower.includes('workshop') || lower.includes('free') || lower.includes('paid')) {
      return this.knowledgeBase['workshops'];
    }

    if (lower.includes('contact') || lower.includes('phone') || lower.includes('email') || lower.includes('whatsapp')) {
      return this.knowledgeBase['contact'];
    }

    if (lower.includes('student') || lower.includes('fresher')) {
      return this.knowledgeBase['audience'];
    }

    if (lower.includes('recommend') || lower.includes('best') || lower.includes('start')) {
      return `${this.knowledgeBase['recommendation']} ${this.knowledgeBase['contact']}`;
    }

    return 'I can help with VidyaOps trainings, workshops, and how to contact the team. Ask about Cloud, Data Analysis, AI, Cybersecurity, or the best path to start.';
  }

  private getLocalCounselorReply(learnerType: string, interest: string, goal: string): string {
    const learner = learnerType.toLowerCase();
    const area = interest.toLowerCase();
    const objective = goal.toLowerCase();

    let recommendation = 'a free workshop';
    let reason = 'because it gives you a low-risk and practical way to explore the domain first.';

    if (area.includes('cloud') || area.includes('data') || area.includes('ai') || area.includes('cyber')) {
      if (objective.includes('career') || objective.includes('practical') || objective.includes('skill')) {
        recommendation = `${interest} training`;
        reason = 'because you want deeper practical growth, not just an introduction.';
      } else if (objective.includes('explore') || objective.includes('first')) {
        recommendation = `${interest} workshop`;
        reason = 'because it gives you clarity before you commit to a larger program.';
      }
    }

    if (learner.includes('student') || learner.includes('fresher')) {
      reason += ' For your stage, clarity and momentum matter more than trying to learn everything at once.';
    }

    return `Based on what you shared, I recommend starting with ${recommendation} ${reason} If you want, continue on the contact page or WhatsApp so VidyaOps can guide you personally.`;
  }

  private getSessionId(): string {
    const key = 'vidyaops_chat_session_id';
    const existing = localStorage.getItem(key);

    if (existing) {
      return existing;
    }

    const generated = crypto.randomUUID();
    localStorage.setItem(key, generated);
    return generated;
  }

  private persistLead(lead: LeadCaptureData): void {
    localStorage.setItem('vidyaops_lead_prefill', JSON.stringify(lead));
  }
}

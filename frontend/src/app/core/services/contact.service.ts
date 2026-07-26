import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { ContactInquiry } from '../models/site.models';
import { RuntimeConfigService } from './runtime-config.service';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private readonly http = inject(HttpClient);
  private readonly runtimeConfig = inject(RuntimeConfigService);

  async submitInquiry(payload: ContactInquiry): Promise<void> {
    await firstValueFrom(
      this.http.post(this.runtimeConfig.apiUrl('/api/contact'), {
        ...payload,
        source: payload.source || 'angular_contact_form',
      }),
    );
  }

  openInquiryEmail(payload: ContactInquiry): void {
    const subject = encodeURIComponent('New VidyaOps Inquiry');
    const body = encodeURIComponent(
      [
        `Name: ${payload.name}`,
        `Email: ${payload.email}`,
        `Phone: ${payload.phone || ''}`,
        `Company or College: ${payload.organization || ''}`,
        `Interested In: ${payload.interest}`,
        '',
        'Message:',
        payload.message,
      ].join('\n'),
    );

    window.location.href = `mailto:info@vidyaops.com?subject=${subject}&body=${body}`;
  }
}

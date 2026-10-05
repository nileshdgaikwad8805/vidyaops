import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { ContactInquiry } from '../models/site.models';

const WEB3FORMS_ACCESS_KEY = '0be77e00-31bc-46c1-ae9f-f2533b47dd86';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private readonly http = inject(HttpClient);

  async submitInquiry(payload: ContactInquiry): Promise<void> {
    const body = {
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: `New VidyaOps Inquiry from ${payload.name}`,
      name: payload.name,
      email: payload.email,
      phone: payload.phone || '',
      organization: payload.organization || '',
      interest: payload.interest || '',
      message: payload.message,
      from_name: 'VidyaOps Website',
    };

    const response = await firstValueFrom(
      this.http.post<{ success: boolean }>('https://api.web3forms.com/submit', body),
    );

    if (!response.success) {
      throw new Error('Form submission failed');
    }
  }

  buildInquiryMailto(payload: ContactInquiry): string {
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

    return `mailto:info@vidyaops.com?subject=${subject}&body=${body}`;
  }

  openInquiryEmail(payload: ContactInquiry): void {
    window.location.href = this.buildInquiryMailto(payload);
  }
}

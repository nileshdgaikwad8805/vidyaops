import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { RuntimeConfigService } from '../../../../core/services/runtime-config.service';

const WEB3FORMS_ACCESS_KEY = '0be77e00-31bc-46c1-ae9f-f2533b47dd86';

@Component({
  selector: 'app-volunteer',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './volunteer.component.html',
  styleUrl: './volunteer.component.scss'
})
export class VolunteerComponent {
  private readonly http = inject(HttpClient);
  private readonly runtimeConfig = inject(RuntimeConfigService);

  readonly submitted = signal(false);
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');

  formData = {
    name: '',
    email: '',
    phone: '',
    linkedin_url: '',
    topic_of_choice: '',
  };

  resumeFile: File | null = null;
  photoFile: File | null = null;

  onFileChange(event: Event, type: 'resume' | 'photo'): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;
    if (type === 'resume') {
      this.resumeFile = file;
    } else {
      this.photoFile = file;
    }
  }

  private async sendViaWeb3Forms(): Promise<void> {
    const fileInfo = [
      this.resumeFile ? `Resume: ${this.resumeFile.name}` : '',
      this.photoFile ? `Photo: ${this.photoFile.name}` : '',
    ].filter(Boolean).join(', ');

    const body = {
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: `New VidyaOps Volunteer Application from ${this.formData.name}`,
      name: this.formData.name,
      email: this.formData.email,
      phone: this.formData.phone || 'Not provided',
      linkedinUrl: this.formData.linkedin_url || 'Not provided',
      topicOfChoice: this.formData.topic_of_choice,
      attachedFiles: fileInfo || 'No files attached',
      message: `Volunteer Application\n\nName: ${this.formData.name}\nEmail: ${this.formData.email}\nPhone: ${this.formData.phone || 'Not provided'}\nLinkedIn: ${this.formData.linkedin_url || 'Not provided'}\nTopic: ${this.formData.topic_of_choice}\n${fileInfo ? 'Files: ' + fileInfo : ''}`,
      from_name: 'VidyaOps Volunteer Application',
    };

    const response = await firstValueFrom(
      this.http.post<{ success: boolean }>('https://api.web3forms.com/submit', body),
    );

    if (!response.success) {
      throw new Error('Web3Forms submission failed');
    }
  }

  async onSubmit(): Promise<void> {
    if (this.isSubmitting()) return;
    this.isSubmitting.set(true);
    this.errorMessage.set('');

    try {
      const form = new FormData();
      form.append('name', this.formData.name);
      form.append('email', this.formData.email);
      form.append('phone', this.formData.phone);
      form.append('linkedin_url', this.formData.linkedin_url);
      form.append('topic_of_choice', this.formData.topic_of_choice);
      if (this.resumeFile) form.append('resume', this.resumeFile);
      if (this.photoFile) form.append('photo', this.photoFile);

      try {
        await firstValueFrom(
          this.http.post(this.runtimeConfig.apiUrl('/api/volunteer/apply'), form),
        );
        this.submitted.set(true);
      } catch {
        await this.sendViaWeb3Forms();
        this.submitted.set(true);
      }
    } catch {
      this.errorMessage.set('Something went wrong. Please try again or email us directly at info@vidyaops.com.');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}

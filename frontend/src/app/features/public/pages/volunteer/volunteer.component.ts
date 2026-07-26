import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { RuntimeConfigService } from '../../../../core/services/runtime-config.service';

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

      await firstValueFrom(
        this.http.post(this.runtimeConfig.apiUrl('/api/volunteer/apply'), form),
      );
      this.submitted.set(true);
    } catch {
      this.errorMessage.set('Something went wrong. Please try again or email us directly at info@vidyaops.com.');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}

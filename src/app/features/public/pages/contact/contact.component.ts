import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../../../core/services/contact.service';
import { ContactInquiry } from '../../../../core/models/site.models';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  private readonly contactService = inject(ContactService);

  readonly submitted = signal(false);
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');

  formData: ContactInquiry = {
    name: '',
    email: '',
    phone: '',
    organization: '',
    interest: '',
    message: '',
  };

  async onSubmit(): Promise<void> {
    if (this.isSubmitting()) return;
    this.isSubmitting.set(true);
    this.errorMessage.set('');
    try {
      await this.contactService.submitInquiry(this.formData);
      this.submitted.set(true);
    } catch {
      this.errorMessage.set(
        'Unable to send online. Click below to open your email client instead.'
      );
    } finally {
      this.isSubmitting.set(false);
    }
  }

  openMailFallback(): void {
    this.contactService.openInquiryEmail(this.formData);
  }
}

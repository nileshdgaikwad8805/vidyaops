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
    try {
      await this.contactService.submitInquiry(this.formData);
      this.submitted.set(true);
    } catch {
      this.contactService.openInquiryEmail(this.formData);
    } finally {
      this.isSubmitting.set(false);
    }
  }
}

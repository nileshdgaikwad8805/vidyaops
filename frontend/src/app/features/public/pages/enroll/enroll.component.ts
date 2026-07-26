import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { RuntimeConfigService } from '../../../../core/services/runtime-config.service';

const WEB3FORMS_ACCESS_KEY = '0be77e00-31bc-46c1-ae9f-f2533b47dd86';

@Component({
  selector: 'app-enroll',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './enroll.component.html',
  styleUrl: './enroll.component.scss'
})
export class EnrollComponent {
  private readonly http = inject(HttpClient);
  private readonly runtimeConfig = inject(RuntimeConfigService);

  readonly submitted = signal(false);
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');
  readonly selectedProduct = signal<'free' | 'paid' | ''>('');

  formData = {
    productId: '',
    name: '',
    email: '',
    phone: '',
    learnerType: '',
    goal: '',
  };

  selectProduct(type: 'free' | 'paid'): void {
    this.selectedProduct.set(type);
    this.formData.productId = type;
  }

  private async sendViaWeb3Forms(): Promise<void> {
    const type = this.selectedProduct() === 'paid' ? 'Paid Masterclass' : 'Free Workshop';
    const body = {
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: `New VidyaOps Enrollment — ${type} from ${this.formData.name}`,
      name: this.formData.name,
      email: this.formData.email,
      phone: this.formData.phone,
      learnerType: this.formData.learnerType,
      goal: this.formData.goal || 'Not specified',
      enrollmentType: type,
      from_name: 'VidyaOps Enrollment',
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
      if (this.selectedProduct() === 'paid') {
        let orderResponse;
        try {
          orderResponse = await firstValueFrom(
            this.http.post<{ orderId: string; amount: number; keyId: string }>(
              this.runtimeConfig.apiUrl('/api/payments/razorpay/order'),
              { ...this.formData },
            ),
          );
        } catch {
          await this.sendViaWeb3Forms();
          this.submitted.set(true);
          return;
        }

        const options: any = {
          key: orderResponse.keyId,
          amount: orderResponse.amount,
          currency: 'INR',
          name: 'VidyaOps',
          order_id: orderResponse.orderId,
          handler: async (response: any) => {
            try {
              await firstValueFrom(
                this.http.post(this.runtimeConfig.apiUrl('/api/payments/razorpay/verify'), {
                  ...response,
                  ...this.formData,
                }),
              );
              window.location.href = '/payment-success';
            } catch {
              this.errorMessage.set('Payment verification failed. Please contact support.');
              this.isSubmitting.set(false);
            }
          },
          prefill: {
            name: this.formData.name,
            email: this.formData.email,
            contact: this.formData.phone,
          },
          theme: { color: '#0d9488' },
        };

        const razorpay = new (window as any).Razorpay(options);
        razorpay.on('payment.failed', () => {
          this.errorMessage.set('Payment failed. Please try again.');
          this.isSubmitting.set(false);
        });
        razorpay.open();
        return;
      }

      try {
        await firstValueFrom(
          this.http.post(this.runtimeConfig.apiUrl('/api/enrollments/free'), this.formData),
        );
        window.location.href = '/payment-success';
      } catch {
        await this.sendViaWeb3Forms();
        this.submitted.set(true);
      }
    } catch {
      this.errorMessage.set('Something went wrong. Please try again or contact us at info@vidyaops.com.');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}

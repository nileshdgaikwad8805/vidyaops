import { Pipe, PipeTransform } from '@angular/core';

const PHONE_PREFIX = '+91';

/**
 * Formats a 10-digit Indian mobile number for display, e.g. 9503685152 becomes
 * "+91 95036 85152". Numbers that are not 10 digits are returned untouched.
 */
@Pipe({
  name: 'phoneDisplay',
  standalone: true,
})
export class PhoneDisplayPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    const raw = (value ?? '').replace(/\D/g, '');

    if (raw.length === 10) {
      return `${PHONE_PREFIX} ${raw.slice(0, 5)} ${raw.slice(5)}`;
    }

    if (raw.length === 12 && raw.startsWith('91')) {
      return `+${raw.slice(0, 2)} ${raw.slice(2, 7)} ${raw.slice(7)}`;
    }

    return (value ?? '').trim();
  }
}

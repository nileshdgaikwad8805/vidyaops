import { Pipe, PipeTransform } from '@angular/core';

/**
 * Truncates text on a word boundary and appends an ellipsis. Used for card copy
 * and meta descriptions so long CMS strings never break a layout.
 */
@Pipe({
  name: 'truncate',
  standalone: true,
})
export class TruncatePipe implements PipeTransform {
  transform(value: string | null | undefined, limit = 140, ellipsis = '…'): string {
    const text = (value ?? '').trim();

    if (text.length <= limit) {
      return text;
    }

    const clipped = text.slice(0, limit);
    const lastSpace = clipped.lastIndexOf(' ');

    return `${(lastSpace > 0 ? clipped.slice(0, lastSpace) : clipped).trimEnd()}${ellipsis}`;
  }
}

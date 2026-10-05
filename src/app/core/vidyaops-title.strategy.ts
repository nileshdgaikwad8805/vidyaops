import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

const BRAND = 'VidyaOps';

/**
 * Appends the brand to every route that sets a `title`, so page titles stay
 * consistent without repeating the suffix in the route table.
 */
@Injectable()
export class VidyaopsTitleStrategy extends TitleStrategy {
  private readonly document = inject(DOCUMENT);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const routeTitle = this.buildTitle(snapshot);

    if (routeTitle) {
      this.document.title = routeTitle === BRAND ? BRAND : `${routeTitle} | ${BRAND}`;
    }
  }
}

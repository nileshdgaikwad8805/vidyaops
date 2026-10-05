import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, TitleStrategy } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { VidyaopsTitleStrategy } from './vidyaops-title.strategy';
import { routes } from '../app.routes';

describe('VidyaopsTitleStrategy', () => {
  async function navigateTo(url: string): Promise<void> {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: TitleStrategy, useClass: VidyaopsTitleStrategy },
      ],
    });

    await RouterTestingHarness.create(url);
  }

  it('should be used as the app TitleStrategy', async () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: TitleStrategy, useClass: VidyaopsTitleStrategy },
      ],
    });

    expect(TestBed.inject(TitleStrategy)).toBeInstanceOf(VidyaopsTitleStrategy);
  });

  it('should append the brand to a titled route', async () => {
    await navigateTo('/about');

    expect(document.title).toBe('About | VidyaOps');
  });

  it('should brand the home route', async () => {
    await navigateTo('/');

    expect(document.title).toBe('Practical Tech Training | VidyaOps');
  });

  it('should title the wildcard route', async () => {
    await navigateTo('/this-page-does-not-exist');

    expect(document.title).toBe('Page not found | VidyaOps');
  });
});

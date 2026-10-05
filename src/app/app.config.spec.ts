import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TitleStrategy } from '@angular/router';

import { appConfig } from './app.config';
import { VidyaopsTitleStrategy } from './core/vidyaops-title.strategy';

describe('appConfig', () => {
  it('should be a valid ApplicationConfig with providers', () => {
    expect(appConfig.providers.length).toBeGreaterThan(0);
  });

  it('should register the VidyaOps title strategy', async () => {
    await TestBed.configureTestingModule({
      providers: [
        ...appConfig.providers,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    expect(TestBed.inject(TitleStrategy)).toBeInstanceOf(VidyaopsTitleStrategy);
  });
});

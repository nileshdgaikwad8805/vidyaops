import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { ContactService } from './contact.service';
import { ContactInquiry } from '../models/site.models';

describe('ContactService', () => {
  let service: ContactService;
  let httpMock: HttpTestingController;

  const inquiry: ContactInquiry = {
    name: 'Asha',
    email: 'asha@example.com',
    interest: 'Cloud training',
    message: 'I would like to know about weekend batches.',
  };

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ContactService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should post the inquiry to web3forms', async () => {
    const promise = service.submitInquiry(inquiry);

    const req = httpMock.expectOne('https://api.web3forms.com/submit');
    expect(req.request.method).toBe('POST');
    expect(req.request.body['name']).toBe('Asha');
    expect(req.request.body['email']).toBe('asha@example.com');
    expect(req.request.body['message']).toBe(inquiry.message);
    expect(req.request.body['access_key']).toBeTruthy();
    req.flush({ success: true });

    await expectAsync(promise).toBeResolved();
  });

  it('should default optional fields to empty strings', async () => {
    const promise = service.submitInquiry(inquiry);

    const req = httpMock.expectOne('https://api.web3forms.com/submit');
    expect(req.request.body['phone']).toBe('');
    expect(req.request.body['organization']).toBe('');
    req.flush({ success: true });

    await expectAsync(promise).toBeResolved();
  });

  it('should throw when web3forms reports failure', async () => {
    const promise = service.submitInquiry(inquiry);
    httpMock.expectOne('https://api.web3forms.com/submit').flush({ success: false });

    await expectAsync(promise).toBeRejectedWithError('Form submission failed');
  });

  it('should build a mailto link addressed to info@vidyaops.com', () => {
    expect(service.buildInquiryMailto(inquiry)).toContain('mailto:info@vidyaops.com');
  });

  it('should include the inquiry details in the mailto body', () => {
    const decoded = decodeURIComponent(service.buildInquiryMailto(inquiry));

    expect(decoded).toContain('Name: Asha');
    expect(decoded).toContain('Email: asha@example.com');
    expect(decoded).toContain('Interested In: Cloud training');
    expect(decoded).toContain(inquiry.message);
  });

  it('should leave optional fields blank in the mailto body', () => {
    const decoded = decodeURIComponent(service.buildInquiryMailto(inquiry));

    expect(decoded).toContain('Phone: ');
    expect(decoded).toContain('Company or College: ');
  });
});

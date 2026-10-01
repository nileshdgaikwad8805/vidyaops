import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { ChatbotService } from './chatbot.service';
import { ChatMessage } from '../models/site.models';

describe('ChatbotService', () => {
  let service: ChatbotService;
  let httpMock: HttpTestingController;

  async function configure(apiBase: string): Promise<void> {
    window.VIDYAOPS_CONFIG = { apiBase, runtimeMode: apiBase ? 'long-running' : 'static' };
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ChatbotService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  }

  afterEach(() => {
    localStorage.clear();
    delete window.VIDYAOPS_CONFIG;
  });

  describe('static runtime (no API)', () => {
    beforeEach(async () => configure(''));

    it('should answer a pricing question from the knowledge base', async () => {
      const reply = await service.getReply('what is the pricing?', []);

      expect(reply.toLowerCase()).toContain('pricing');
    });

    it('should answer a contact question with the phone number', async () => {
      const reply = await service.getReply('how do I contact you?', []);

      expect(reply).toContain('9503685152');
    });

    it('should greet on hello', async () => {
      const reply = await service.getReply('hello', []);

      expect(reply).toContain('Welcome to VidyaOps');
    });

    it('should fall back to a menu for an unrecognised question', async () => {
      const reply = await service.getReply('xyzzy plugh', []);

      expect(reply).toContain('What would you like to know?');
    });

    it('should not issue any HTTP requests', async () => {
      await service.getReply('tell me about cloud', []);

      httpMock.expectNone(() => true);
    });

    it('should persist a lead locally', async () => {
      await service.saveLead({
        name: 'Asha',
        contact: 'asha@example.com',
        learnerType: 'student',
        interest: 'cloud',
      });

      expect(service.readPersistedLead()?.name).toBe('Asha');
    });

    it('should return null when no lead has been persisted', () => {
      expect(service.readPersistedLead()).toBeNull();
    });

    it('should return null for corrupt persisted lead JSON', () => {
      localStorage.setItem('vidyaops_lead_prefill', 'not-json');

      expect(service.readPersistedLead()).toBeNull();
    });
  });

  describe('with an API configured', () => {
    beforeEach(async () => configure('https://api.example.com'));

    it('should return the API reply', async () => {
      const history: ChatMessage[] = [{ role: 'user', content: 'hi' }];
      const promise = service.getReply('hi', history);

      const req = httpMock.expectOne('https://api.example.com/api/chat');
      expect(req.request.method).toBe('POST');
      req.flush({ reply: 'Hello from the API' });

      await expectAsync(promise).toBeResolvedTo('Hello from the API');
    });

    it('should fall back to a local reply when the API errors', async () => {
      const promise = service.getReply('what is the pricing?', []);

      httpMock
        .expectOne('https://api.example.com/api/chat')
        .flush('boom', { status: 500, statusText: 'Server Error' });

      const reply = await promise;
      expect(reply.length).toBeGreaterThan(0);
    });

    it('should fall back to a local reply when the API returns no text', async () => {
      const promise = service.getReply('hello', []);

      httpMock.expectOne('https://api.example.com/api/chat').flush({});

      const reply = await promise;
      expect(reply).toContain('Welcome to VidyaOps');
    });

    it('should send the learner context in counselor mode', async () => {
      const promise = service.getCounselorReply('student', 'cloud', 'get a job');

      const req = httpMock.expectOne('https://api.example.com/api/chat');
      expect(req.request.body['mode']).toBe('counselor');
      req.flush({ reply: 'Start with cloud fundamentals.' });

      await expectAsync(promise).toBeResolvedTo('Start with cloud fundamentals.');
    });
  });
});

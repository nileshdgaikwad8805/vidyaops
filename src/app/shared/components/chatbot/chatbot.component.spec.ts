import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { ChatbotComponent } from './chatbot.component';
import { ChatbotService } from '../../../core/services/chatbot.service';

describe('ChatbotComponent', () => {
  let fixture: ComponentFixture<ChatbotComponent>;
  let component: ChatbotComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatbotComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatbotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create closed with a greeting', () => {
    expect(component.isOpen()).toBe(false);
    expect(component.messages().length).toBe(1);
    expect(component.messages()[0].sender).toBe('bot');
  });

  it('should toggle open and closed', () => {
    component.toggle();
    expect(component.isOpen()).toBe(true);

    component.toggle();
    expect(component.isOpen()).toBe(false);
  });

  it('should close', () => {
    component.toggle();
    component.close();

    expect(component.isOpen()).toBe(false);
  });

  it('should ignore an empty draft', async () => {
    await component.sendMessage();

    expect(component.messages().length).toBe(1);
  });

  it('should start lead capture on a high-intent message', async () => {
    component.draft.set('I want to enroll');
    await component.sendMessage();

    const texts = component.messages().map((message) => message.text);
    expect(texts.some((text) => text.includes('What is your name'))).toBeTrue();
  });

  it('should start the counselor flow on a "which course" message', async () => {
    component.draft.set('which course should I take');
    await component.sendMessage();

    const texts = component.messages().map((message) => message.text);
    expect(texts.some((text) => text.includes('college student'))).toBeTrue();
  });

  it('should delegate a normal question to the chatbot service', async () => {
    const service = TestBed.inject(ChatbotService);
    spyOn(service, 'getReply').and.resolveTo('Here is an answer.');

    component.draft.set('do you offer weekend batches?');
    await component.sendMessage();

    expect(service.getReply).toHaveBeenCalled();
    expect(component.messages().at(-1)?.text).toBe('Here is an answer.');
    expect(component.isLoading()).toBe(false);
  });
});

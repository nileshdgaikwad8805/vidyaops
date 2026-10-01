import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevealOnScrollDirective } from './reveal-on-scroll.directive';

@Component({
  standalone: true,
  imports: [RevealOnScrollDirective],
  template: '<div appRevealOnScroll class="reveal-on-scroll">Revealed</div>',
})
class HostComponent {}

class FakeIntersectionObserver {
  static lastInstance: FakeIntersectionObserver | undefined;

  readonly observed: Element[] = [];
  disconnected = false;
  unobserved: Element[] = [];

  constructor(private readonly callback: IntersectionObserverCallback) {
    FakeIntersectionObserver.lastInstance = this;
  }

  observe(target: Element): void {
    this.observed.push(target);
  }

  unobserve(target: Element): void {
    this.unobserved.push(target);
  }

  disconnect(): void {
    this.disconnected = true;
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  trigger(target: Element, isIntersecting: boolean): void {
    this.callback(
      [{ target, isIntersecting } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    );
  }
}

describe('RevealOnScrollDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let target: HTMLElement;
  let original: typeof IntersectionObserver;

  beforeEach(async () => {
    original = window.IntersectionObserver;
    window.IntersectionObserver =
      FakeIntersectionObserver as unknown as typeof IntersectionObserver;
    FakeIntersectionObserver.lastInstance = undefined;

    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    target = (fixture.nativeElement as HTMLElement).querySelector('.reveal-on-scroll')!;
  });

  afterEach(() => {
    window.IntersectionObserver = original;
  });

  it('should observe the host element', () => {
    expect(FakeIntersectionObserver.lastInstance?.observed).toContain(target);
  });

  it('should add the revealed class once the element intersects', () => {
    expect(target.classList.contains('revealed')).toBeFalse();

    FakeIntersectionObserver.lastInstance?.trigger(target, true);

    expect(target.classList.contains('revealed')).toBeTrue();
  });

  it('should stop observing after the first reveal', () => {
    FakeIntersectionObserver.lastInstance?.trigger(target, true);

    expect(FakeIntersectionObserver.lastInstance?.unobserved).toContain(target);
  });

  it('should ignore entries that are not intersecting', () => {
    FakeIntersectionObserver.lastInstance?.trigger(target, false);

    expect(target.classList.contains('revealed')).toBeFalse();
  });

  it('should disconnect the observer on destroy', () => {
    const instance = FakeIntersectionObserver.lastInstance!;
    fixture.destroy();

    expect(instance.disconnected).toBeTrue();
  });

  it('should reveal immediately when IntersectionObserver is unavailable', async () => {
    // @ts-expect-error - deliberately removing the API for this test
    delete window.IntersectionObserver;
    TestBed.resetTestingModule();

    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const isolated = TestBed.createComponent(HostComponent);
    isolated.detectChanges();

    const el = (isolated.nativeElement as HTMLElement).querySelector('.reveal-on-scroll')!;
    expect(el.classList.contains('revealed')).toBeTrue();
  });
});

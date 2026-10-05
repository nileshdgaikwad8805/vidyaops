import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';

import { ContentPageComponent } from './content-page.component';

describe('ContentPageComponent', () => {
  let fixture: ComponentFixture<ContentPageComponent>;

  async function createWithPageKey(pageKey: string): Promise<ComponentFixture<ContentPageComponent>> {
    await TestBed.configureTestingModule({
      imports: [ContentPageComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { data: { pageKey } } } },
      ],
    }).compileComponents();

    const created = TestBed.createComponent(ContentPageComponent);
    created.detectChanges();

    return created;
  }

  beforeEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create for a known page key', async () => {
    fixture = await createWithPageKey('about');

    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.componentInstance.pageData?.key).toBe('about');
  });

  it('should leave pageData undefined for an unknown page key', async () => {
    fixture = await createWithPageKey('does-not-exist');

    expect(fixture.componentInstance.pageData).toBeUndefined();
  });
});

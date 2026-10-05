import { PhoneDisplayPipe } from './phone-display.pipe';

describe('PhoneDisplayPipe', () => {
  const pipe = new PhoneDisplayPipe();

  it('should format a 10-digit number', () => {
    expect(pipe.transform('9503685152')).toBe('+91 95036 85152');
  });

  it('should format a number that already has the country code', () => {
    expect(pipe.transform('919503685152')).toBe('+91 95036 85152');
  });

  it('should ignore formatting characters in the input', () => {
    expect(pipe.transform('+91 95036-85152')).toBe('+91 95036 85152');
  });

  it('should pass through an unexpected length untouched', () => {
    expect(pipe.transform('12345')).toBe('12345');
  });

  it('should return an empty string for null', () => {
    expect(pipe.transform(null)).toBe('');
  });
});

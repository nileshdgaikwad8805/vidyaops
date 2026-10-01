import { TruncatePipe } from './truncate.pipe';

describe('TruncatePipe', () => {
  const pipe = new TruncatePipe();

  it('should leave short text untouched', () => {
    expect(pipe.transform('Short copy', 20)).toBe('Short copy');
  });

  it('should truncate on a word boundary', () => {
    expect(pipe.transform('The quick brown fox jumps', 15)).toBe('The quick…');
  });

  it('should keep whole words that fit inside the limit', () => {
    expect(pipe.transform('The quick brown fox jumps', 17)).toBe('The quick brown…');
  });

  it('should hard-trim when there is no space to break on', () => {
    expect(pipe.transform('Supercalifragilistic', 10)).toBe('Supercalif…');
  });

  it('should trim surrounding whitespace before measuring', () => {
    expect(pipe.transform('   Padded copy   ', 50)).toBe('Padded copy');
  });

  it('should return an empty string for null and undefined', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });

  it('should honour a custom ellipsis', () => {
    expect(pipe.transform('The quick brown fox', 10, '...')).toBe('The quick...');
  });
});

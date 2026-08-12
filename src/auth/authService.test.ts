import { describe, expect, it } from 'vitest';
import { safeInternalPath } from './authService';
describe('safe destination restoration', () => {
  it('accepts internal paths and rejects external or executable destinations', () => { expect(safeInternalPath('/download?platform=windows')).toBe('/download?platform=windows'); expect(safeInternalPath('//evil.example')).toBe('/account'); expect(safeInternalPath('https://evil.example')).toBe('/account'); expect(safeInternalPath('javascript:alert(1)')).toBe('/account'); });
});

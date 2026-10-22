/**
 * sanitizeRichHtml must neutralise the payloads the client product
 * descriptions can realistically contain while keeping formatting.
 */
import { describe, it, expect } from 'vitest';
import { sanitizeRichHtml } from '@/lib/utils/security';
import { isSafeInternalPath } from '@/lib/utils/navigation';

describe('sanitizeRichHtml', () => {
  it('returns empty string for empty input', () => {
    expect(sanitizeRichHtml('')).toBe('');
  });

  it('strips <svg/onload=alert(1)>', () => {
    const out = sanitizeRichHtml('<svg/onload=alert(1)>click');
    expect(out).not.toContain('<svg');
    expect(out).not.toContain('onload');
    expect(out).not.toContain('alert');
  });

  it('strips <img src=x onerror=alert(1)> handler', () => {
    const out = sanitizeRichHtml('<p>hi</p><img src=x onerror=alert(1)>');
    expect(out).toContain('<p>hi</p>');
    expect(out).not.toContain('onerror');
    expect(out).not.toContain('alert');
  });

  it('strips <style> blocks', () => {
    const out = sanitizeRichHtml('<style>body{display:none}</style><p>text</p>');
    expect(out).not.toContain('<style');
    expect(out).not.toContain('display:none');
    expect(out).toContain('<p>text</p>');
  });

  it('strips <script> tags', () => {
    const out = sanitizeRichHtml('<script>alert(1)</script><p>safe</p>');
    expect(out).not.toContain('<script');
    expect(out).not.toContain('alert');
    expect(out).toContain('<p>safe</p>');
  });

  it('neutralises javascript: hrefs', () => {
    const out = sanitizeRichHtml('<a href="javascript:alert(1)">x</a>');
    expect(out).not.toContain('javascript:');
  });

  it('keeps p, ul, li, strong, a', () => {
    const html = '<p>Hello <strong>world</strong></p><ul><li>one</li><li>two</li></ul><a href="https://example.com">link</a>';
    const out = sanitizeRichHtml(html);
    expect(out).toContain('<p>');
    expect(out).toContain('<strong>world</strong>');
    expect(out).toContain('<ul>');
    expect(out).toContain('<li>one</li>');
    expect(out).toContain('<li>two</li>');
    expect(out).toContain('<a href="https://example.com">link</a>');
  });
});

describe('isSafeInternalPath', () => {
  it('accepts same-origin paths', () => {
    expect(isSafeInternalPath('/cart/checkout')).toBe(true);
    expect(isSafeInternalPath('/account/order/12')).toBe(true);
  });

  it('rejects absolute and protocol-relative off-site targets', () => {
    expect(isSafeInternalPath('https://evil.example.com/checkout')).toBe(false);
    expect(isSafeInternalPath('//evil.example.com/checkout')).toBe(false);
  });

  it('rejects javascript: and empty values', () => {
    expect(isSafeInternalPath('javascript:alert(1)')).toBe(false);
    expect(isSafeInternalPath('')).toBe(false);
    expect(isSafeInternalPath(null)).toBe(false);
    expect(isSafeInternalPath(undefined)).toBe(false);
  });
});

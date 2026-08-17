import { describe, it, expect, beforeEach, vi } from 'vitest';
import { captureAttribution } from './attribution';

describe('captureAttribution', () => {
  beforeEach(() => {
    // Clear localStorage and sessionStorage
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear cookies
    document.cookie.split(';').forEach(c => {
      document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });

    // Reset window.location
    Object.defineProperty(window, 'location', {
      value: {
        search: '',
        hostname: 'solatide.com',
        href: 'https://solatide.com/'
      },
      writable: true
    });

    // Reset document.referrer
    Object.defineProperty(document, 'referrer', {
      value: '',
      writable: true
    });
  });

  it('should identify Google Ads traffic via gclid', () => {
    window.location.search = '?gclid=12345';
    
    captureAttribution();
    
    const dataStr = localStorage.getItem('solatide_attribution_first_touch');
    expect(dataStr).toBeTruthy();
    
    const data = JSON.parse(dataStr!);
    expect(data.source).toBe('Google');
    expect(data.channel).toBe('cpc');
    expect(data.gclid).toBe('12345');
  });

  it('should identify Facebook Ads traffic via fbclid', () => {
    window.location.search = '?fbclid=abcde';
    
    captureAttribution();
    
    const data = JSON.parse(localStorage.getItem('solatide_attribution_first_touch')!);
    expect(data.source).toBe('Facebook');
    expect(data.channel).toBe('social');
    expect(data.fbclid).toBe('abcde');
  });

  it('should identify UTM parameters correctly', () => {
    window.location.search = '?utm_source=newsletter&utm_medium=email&utm_campaign=summer_sale';
    
    captureAttribution();
    
    const data = JSON.parse(localStorage.getItem('solatide_attribution_first_touch')!);
    expect(data.source).toBe('newsletter');
    expect(data.channel).toBe('email');
    expect(data.utmCampaign).toBe('summer_sale');
  });

  it('should classify organic Google search correctly', () => {
    Object.defineProperty(document, 'referrer', {
      value: 'https://www.google.com/',
      writable: true
    });
    
    captureAttribution();
    
    const data = JSON.parse(localStorage.getItem('solatide_attribution_first_touch')!);
    expect(data.source).toBe('Google');
    expect(data.channel).toBe('organic');
  });

  it('should ignore internal referrers', () => {
    Object.defineProperty(document, 'referrer', {
      value: 'https://solatide.com/some-page',
      writable: true
    });
    
    captureAttribution();
    
    const data = JSON.parse(localStorage.getItem('solatide_attribution_first_touch')!);
    expect(data.source).toBe('Direct');
    expect(data.channel).toBe('direct');
  });

  it('should track last touch independently of first touch', () => {
    // First touch: Organic Search
    Object.defineProperty(document, 'referrer', {
      value: 'https://www.google.com/',
      writable: true
    });
    captureAttribution();

    // Verify first touch
    const firstTouch = JSON.parse(localStorage.getItem('solatide_attribution_first_touch')!);
    expect(firstTouch.source).toBe('Google');
    expect(firstTouch.channel).toBe('organic');

    // Simulate returning later via Email campaign
    Object.defineProperty(document, 'referrer', { value: '', writable: true });
    window.location.search = '?utm_source=newsletter&utm_medium=email';
    
    // Clear session to simulate new session
    sessionStorage.clear();
    captureAttribution();

    // First touch should remain unchanged
    const firstTouchAgain = JSON.parse(localStorage.getItem('solatide_attribution_first_touch')!);
    expect(firstTouchAgain.source).toBe('Google');

    // Last touch should be updated
    const lastTouch = JSON.parse(sessionStorage.getItem('solatide_attribution_last_touch')!);
    expect(lastTouch.source).toBe('newsletter');
    expect(lastTouch.channel).toBe('email');
  });

  it('should overwrite Direct/Unknown first touch if a strong signal arrives', () => {
    // First touch: Direct
    captureAttribution();
    
    let firstTouch = JSON.parse(localStorage.getItem('solatide_attribution_first_touch')!);
    expect(firstTouch.source).toBe('Direct / Unknown');

    // Simulate returning later with UTMs
    window.location.search = '?utm_source=test_newsletter&utm_medium=email';
    captureAttribution();

    // First touch should be overwritten because the original was just Direct
    firstTouch = JSON.parse(localStorage.getItem('solatide_attribution_first_touch')!);
    expect(firstTouch.source).toBe('test_newsletter');
    expect(firstTouch.channel).toBe('email');
  });
});

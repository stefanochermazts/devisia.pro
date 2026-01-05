import { describe, expect, it } from 'vitest';
import { deleteCookie, getCookie, getJsonCookie, setCookie, setJsonCookie } from './cookie';

describe('cookie helpers', () => {
  it('setCookie + getCookie roundtrip', () => {
    setCookie('test_cookie', 'hello');
    expect(getCookie('test_cookie')).toBe('hello');
  });

  it('deleteCookie removes cookie', () => {
    setCookie('delete_me', '1');
    expect(getCookie('delete_me')).toBe('1');
    deleteCookie('delete_me');
    expect(getCookie('delete_me')).toBeUndefined();
  });

  it('getJsonCookie returns undefined for invalid JSON', () => {
    setCookie('bad_json', '{not-json');
    expect(getJsonCookie('bad_json')).toBeUndefined();
  });

  it('setJsonCookie + getJsonCookie roundtrip', () => {
    setJsonCookie('json_cookie', { a: 1, b: true });
    expect(getJsonCookie<{ a: number; b: boolean }>('json_cookie')).toEqual({ a: 1, b: true });
  });
});


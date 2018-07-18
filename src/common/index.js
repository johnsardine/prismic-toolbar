import 'regenerator-runtime/runtime';

export { getCookie, setCookie, deleteCookie, demolishCookie } from './cookie';
export { div, script, deleteNodes } from './domnodes';
export { Messenger } from './messenger';
export { Publisher } from './publisher';
export { Hooks } from './hooks';
export {
  normalizeDocument,
  normalizeDraft,
  normalizeState,
  normalizeRef,
} from './normalize';

// Switchy
export const switchy = (val = '') => (obj = {}) => {
  if (typeof obj[val] === 'function') return obj[val]();
  return obj[val] || obj._ || null;
};

// Fetch Wrapper
export const fetchy = ({ url, ...other }) => fetch(url, other).then(r => r.json());

// ReadyDOM - DOM Listener is useless (await X is already asynchronous)
export const readyDOM = async () => {
  if (document.readyState !== 'complete') await wait(0);
  return true;
};

// Wait in seconds
export const wait = seconds => new Promise(rs => setTimeout(rs, seconds * 1000));

// Wait in milliseconds
export const delay = t => new Promise(rs => setTimeout(rs, t));

// Reload
export const reload = url => window.location.reload(url);

// Cookies disabled
export const disabledCookies = () => !navigator.cookieEnabled;

// Random id
export const random = num => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return [...Array(num)]
    .map(() => chars[Math.floor(Math.random() * chars.length)])
    .join('');
};

// Build querystring
export function query(obj) {
  if (!obj) return '';
  return Object.entries(obj)
    .filter(v => v)
    .map(pair => pair.map(encodeURIComponent).join('='))
    .join('&');
}

// Parse querystring
export const parseQuery = _uri => {
  if (!_uri) return {};
  const qs = _uri.split('?')[1];
  if (!qs) return {};
  return qs
    .split('&')
    .filter(v => v)
    .map(v => v.split('='))
    .reduce(
      (acc, curr) =>
        Object.assign(acc, {
          [decodeURIComponent(curr[0])]: curr[1] && decodeURIComponent(curr[1]),
        }),
      {}
    );
};

// Normalize string TODO IE polyfill
export const slugify = str => str.normalize('NFD');

// Invalid prismic endpoint
export const endpointWarning = () =>
  console.warn(`Invalid window.prismic.endpoint.
Learn how to set it up in the documentation: https://prismic.link/2LQcOWJ.
https://github.com/prismicio/prismic-toolbar`);

// Copy to clipboard TODO
export function copyToClipboard(text) {
  // IE specific code path to prevent textarea being shown while dialog is visible.
  if (window.clipboardData && window.clipboardData.setData) {
    return window.clipboardData.setData('Text', text);
  }

  if (document.queryCommandSupported('copy')) {
    const textarea = document.createElement('textarea');
    textarea.textContent = text;
    textarea.style.position = 'fixed'; // Prevent scrolling to bottom of page in MS Edge.
    document.body.appendChild(textarea);
    textarea.select();
    try {
      return document.execCommand('copy'); // Security exception may be thrown by some browsers.
    } catch (ex) {
      console.warn('Copy to clipboard failed.', ex);
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  }
}

// Throttle (https://codeburst.io/throttling-and-debouncing-in-javascript-b01cad5c8edf)
export const throttle = (func, timeout) => {
  let queue;
  let lastReturn;
  let lastRan = -Infinity;
  return function() {
    const since = Date.now() - lastRan;
    const due = since >= timeout;
    const run = () => {
      lastRan = Date.now();
      lastReturn = func.apply(this, arguments);
    };
    clearTimeout(queue);
    if (due) run();
    else queue = setTimeout(run, timeout - since);
    return lastReturn;
  };
};

// Simple location object
export const getLocation = () => {
  const {
    href,
    origin,
    protocol,
    host,
    hostname,
    port,
    pathname,
    search,
    hash,
  } = window.location;
  return {
    href,
    origin,
    protocol,
    host,
    hostname,
    port,
    pathname,
    search,
    hash,
  };
};
import { random, Hooks } from '@babel/preset-stage-2';
import { PreviewCookie } from './preview-cookie';

// One breaker interval per scope (tab but ideally browser)
let breakerInterval;

// Tracker
export class Tracker {
  constructor(messenger) {
    // Assign
    this.cookie = new PreviewCookie(messenger.hostname);
    this.messenger = messenger;
    this.hooks = new Hooks();
    this.auth = Boolean(PreviewCookie.track);

    // Quick track
    this.track();

    // Track
    this.messenger.post('state').then(state => {
      this.auth = state.auth;
      this.track();
    });
  }

  // Track
  track() {
    this.auth ? this.setup() : this.cleanup();
  }

  setup() {
    // Switch
    if (this.tracking === true) return;
    this.tracking = true;

    // Update track once per page
    PreviewCookie.track = random(8);

    // Update breaker every 150ms
    clearInterval(breakerInterval);
    // breakerInterval = setInterval(_ => (PreviewCookie.breaker = random(8)), 150);

    // Hooks for updating url
    this.hooks.on('keydown', () => (PreviewCookie.url = null));
    this.hooks.on('unload', () => (PreviewCookie.url = null));
    this.hooks.on('beforeRequest', () => {
      clearTimeout(this.clearUrl);
      PreviewCookie.url = window.location.pathname;
      this.clearUrl = setTimeout(() => (PreviewCookie.url = null), 300);
    });
  }

  cleanup() {
    // Switch
    if (this.tracking === false) return;
    this.tracking = false;

    // Reset
    this.hooks.off();
    clearInterval(breakerInterval);
    PreviewCookie.track = null;
    PreviewCookie.url = null;
    PreviewCookie.breaker = null;
  }
}

/**
 * server-renderer.js
 *
 * Server-side renderer for SSR pages.
 * Compiled by webpack/webpack.server.js into dist/server.bundle.js.
 *
 * Uses CommonJS require() so globals are set BEFORE any component
 * modules are loaded (ES module imports are hoisted by Babel/Webpack,
 * but require() calls run in order).
 */

'use strict';

// ─── 1. Polyfill browser globals so SSR-incompatible libs don't crash ────────
// Components should still check `typeof window === 'undefined'` themselves
// for logic that must NOT run on the server (e.g. Swiper rendering).
// These stubs only prevent import-time crashes in deps that reference
// browser globals unconditionally.
if (typeof window === 'undefined') {
  // React 16 scheduler reads timing & async APIs directly from window.*
  // (see: "Capture local references to native APIs" in scheduler source).
  // Every property it accesses must be present here or it crashes.
  global.window = {
    // ── timing / async (React scheduler) ──────────────────────────────
    Date,
    performance: typeof performance !== 'undefined' ? performance : { now: () => Date.now() },
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    requestAnimationFrame: cb => setTimeout(cb, 0),
    cancelAnimationFrame: id => clearTimeout(id),
    // ── routing / navigation ──────────────────────────────────────────
    location: {
      host: '',
      hostname: '',
      href: '',
      pathname: '/',
      search: '',
      hash: '',
      port: ''
    },
    // ── misc ──────────────────────────────────────────────────────────
    __IS_SSR__: true,
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    scrollTo: () => {},
    innerWidth: 1200,
    innerHeight: 800
  };
  global.document = {
    createElement: () => ({
      style: {},
      setAttribute: () => {},
      appendChild: () => {},
      classList: { add: () => {}, remove: () => {}, contains: () => false }
    }),
    createElementNS: () => ({ setAttribute: () => {}, style: {} }),
    body: {
      style: {},
      appendChild: () => {},
      classList: { add: () => {}, remove: () => {}, contains: () => false }
    },
    documentElement: { style: {}, lang: '', clientHeight: 800, clientWidth: 1200 },
    head: { appendChild: () => {}, querySelector: () => null },
    getElementById: () => null,
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener: () => {},
    removeEventListener: () => {},
    readyState: 'complete'
  };
  // global.navigator is a read-only getter in Node 21+ — must use defineProperty
  try {
    Object.defineProperty(global, 'navigator', {
      value: { userAgent: 'node', platform: '' },
      writable: true,
      configurable: true
    });
  } catch (e) { /* ignore if still not settable */ }
  global.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
  global.sessionStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
  global.MutationObserver = class { observe() {} disconnect() {} };
  global.ResizeObserver = class { observe() {} disconnect() {} };
  global.requestAnimationFrame = cb => setTimeout(cb, 0);
  global.cancelAnimationFrame = id => clearTimeout(id);
}

// ─── 2. Polyfill regeneratorRuntime (Babel async/generator transform) ────────
// Babel compiles async functions to regenerator-runtime calls. The runtime
// must be registered globally before any component module is loaded.
require('regenerator-runtime/runtime');

// ─── 3. Load dependencies AFTER globals are set ───────────────────────────────
const React = require('react');
const { renderToString } = require('react-dom/server');
const { StaticRouter } = require('react-router-dom');
const { Provider } = require('react-redux');
const { createStore, applyMiddleware } = require('redux');
const thunk = require('redux-thunk').default;
const { createMemoryHistory } = require('history');
const { routerMiddleware } = require('connected-react-router');

const createReducer = require('./reducers').default;
const Homepage = require('./containers/Homepage').default;
const ObituaryPage = require('./containers/Obituary').default;
const AboutUs = require('./containers/About').default;
const OurServices = require('./containers/OurServices').default;
const AllObituaries = require('./containers/AllObituaries').default;
const BlogList = require('./containers/Blog/Bloglist').default;
const FAQ = require('./containers/FAQ').default;

// ─── 3. Helpers ───────────────────────────────────────────────────────────────
function createServerStore() {
  const history = createMemoryHistory();
  return createStore(
    createReducer(history),
    applyMiddleware(thunk, routerMiddleware(history))
  );
}

// ─── 4. Exported render functions ─────────────────────────────────────────────
function renderHomepageToString(serverSideData) {
  const store = createServerStore();
  return renderToString(
    React.createElement(
      Provider,
      { store },
      React.createElement(
        StaticRouter,
        { location: '/', context: {} },
        React.createElement(Homepage, { serverSideData })
      )
    )
  );
}

function renderObituaryToString(slug, serverSideData) {
  const store = createServerStore();
  return renderToString(
    React.createElement(
      Provider,
      { store },
      React.createElement(
        StaticRouter,
        { location: `/obituary/${slug}`, context: {} },
        React.createElement(ObituaryPage, {
          serverSideData,
          match: { params: { slug } }
        })
      )
    )
  );
}

// About Us — fully static, no data needed
function renderAboutToString() {
  const store = createServerStore();
  return renderToString(
    React.createElement(
      Provider,
      { store },
      React.createElement(
        StaticRouter,
        { location: '/about-us', context: {} },
        React.createElement(AboutUs, null)
      )
    )
  );
}

// Our Services — fully static, no data needed
function renderServicesToString() {
  const store = createServerStore();
  return renderToString(
    React.createElement(
      Provider,
      { store },
      React.createElement(
        StaticRouter,
        { location: '/our-services', context: {} },
        React.createElement(OurServices, null)
      )
    )
  );
}

// All Obituaries listing
function renderAllObituariesToString(serverSideData) {
  const store = createServerStore();
  return renderToString(
    React.createElement(Provider, { store },
      React.createElement(StaticRouter, { location: '/obituaries', context: {} },
        React.createElement(AllObituaries, { serverSideData })
      )
    )
  );
}

// Blog listing
function renderBlogListToString(serverSideData) {
  const store = createServerStore();
  return renderToString(
    React.createElement(Provider, { store },
      React.createElement(StaticRouter, { location: '/blogs', context: {} },
        React.createElement(BlogList, { serverSideData })
      )
    )
  );
}

// FAQ — fully static
function renderFAQToString() {
  const store = createServerStore();
  return renderToString(
    React.createElement(Provider, { store },
      React.createElement(StaticRouter, { location: '/faqs', context: {} },
        React.createElement(FAQ, null)
      )
    )
  );
}

module.exports = {
  renderHomepageToString,
  renderObituaryToString,
  renderAboutToString,
  renderServicesToString,
  renderAllObituariesToString,
  renderBlogListToString,
  renderFAQToString
};

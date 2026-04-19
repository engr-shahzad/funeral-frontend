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
if (typeof window === 'undefined') {
  global.window = {
    Date,
    performance: typeof performance !== 'undefined' ? performance : { now: () => Date.now() },
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    requestAnimationFrame: cb => setTimeout(cb, 0),
    cancelAnimationFrame: id => clearTimeout(id),
    location: {
      host: '',
      hostname: '',
      href: '',
      pathname: '/',
      search: '',
      hash: '',
      port: ''
    },
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

// ─── Helpers ──────────────────────────────────────────────────────────────────
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

// About Us — accepts serverSideData for richTextContent
function renderAboutToString(serverSideData) {
  const store = createServerStore();
  return renderToString(
    React.createElement(
      Provider,
      { store },
      React.createElement(
        StaticRouter,
        { location: '/about-us', context: {} },
        React.createElement(AboutUs, { serverSideData: serverSideData || {} })
      )
    )
  );
}

// Our Services — accepts serverSideData for richTextContent
function renderServicesToString(serverSideData) {
  const store = createServerStore();
  return renderToString(
    React.createElement(
      Provider,
      { store },
      React.createElement(
        StaticRouter,
        { location: '/our-services', context: {} },
        React.createElement(OurServices, { serverSideData: serverSideData || {} })
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

// FAQ — accepts serverSideData for richTextContent
function renderFAQToString(serverSideData) {
  const store = createServerStore();
  return renderToString(
    React.createElement(Provider, { store },
      React.createElement(StaticRouter, { location: '/faqs', context: {} },
        React.createElement(FAQ, { serverSideData: serverSideData || {} })
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

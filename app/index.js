/**
 *
 * index.js
 * This is the entry file for the application
 */

import React from 'react';
import ReactDOM from 'react-dom';

import App from './app';

const rootElement = document.getElementById('root');

// When the page was server-rendered the backend injects window.__SSR_DATA__.
// React must hydrate (not render) so it reuses the existing DOM instead of
// blowing it away and causing a flash of unstyled content.
if (rootElement.hasChildNodes()) {
  ReactDOM.hydrate(<App />, rootElement);
} else {
  ReactDOM.render(<App />, rootElement);
}

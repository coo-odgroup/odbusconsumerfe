import 'zone.js/node';

import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { join } from 'path';

import { AppServerModule } from './src/main.server';
import { APP_BASE_HREF } from '@angular/common';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { existsSync } from 'fs';
import 'localstorage-polyfill';
global['localStorage'] = localStorage;

const domino = require('domino');
const fs = require('fs');
const path = require('path');
// index from browser build!
const template = fs
  .readFileSync(path.join('dist/consumerfenew/browser', 'index.html'))
  .toString();
// for mock global window by domino
const win = domino.createWindow(template);
// mock
global['window'] = win;
// not implemented property and functions
Object.defineProperty(win.document.body.style, 'transform', {
  value: () => {
    return {
      enumerable: true,
      configurable: true,
    };
  },
  writable: true,
});

// mock documnet
global['document'] = win.document;
// othres mock
global['CSS'] = null;
// global['XMLHttpRequest'] = require('xmlhttprequest').XMLHttpRequest;
global['Prism'] = null;

import axios from 'axios';
import { GlobalConstants } from 'src/app/constants/global-constants';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const API_URL = GlobalConstants.BASE_URL;
  const URL = GlobalConstants.URL;
  const server = express();
  const distFolder = join(process.cwd(), 'dist/consumerfenew/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html'))
    ? 'index.original.html'
    : 'index';

  // Add sitemap.xml code here
  server.get('/sitemap.xml', async (req, res) => {
    try {
      const response = await axios.get(
        API_URL+'/getSchemaUrls',
      );

      const routes = response.data.data.routes;
      const operators = response.data.data.operators;

      let xml = `<?xml version="1.0" encoding="UTF-8"?>`;
      xml += `
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      `;

      // Static Pages
      xml += `
        <url>
          <loc>`+API_URL+`/</loc>
          <changefreq>daily</changefreq>
          <priority>1.0</priority>
        </url>
        <url>
          <loc>`+API_URL+`/about-us</loc>
          <changefreq>monthly</changefreq>
          <priority>0.8</priority>
        </url>
        <url>
          <loc>`+API_URL+`/operators</loc>
          <changefreq>monthly</changefreq>
          <priority>0.8</priority>
        </url>
        <url>
          <loc>`+API_URL+`/routes</loc>
          <changefreq>monthly</changefreq>
          <priority>0.8</priority>
        </url>
        <url>
          <loc>`+API_URL+`/offers</loc>
          <changefreq>monthly</changefreq>
          <priority>0.8</priority>
        </url>
        <url>
          <loc>`+API_URL+`/testimonials</loc>
          <changefreq>monthly</changefreq>
          <priority>0.8</priority>
        </url>
        <url>
          <loc>`+API_URL+`/careers</loc>
          <changefreq>monthly</changefreq>
          <priority>0.8</priority>
        </url>
        <url>
          <loc>`+API_URL+`/contact-us</loc>
          <changefreq>monthly</changefreq>
          <priority>0.8</priority>
        </url>
        <url>
          <loc>`+API_URL+`/faq</loc>
          <changefreq>monthly</changefreq>
          <priority>0.8</priority>
        </url>
        <url>
          <loc>`+API_URL+`/terms-conditions</loc>
          <changefreq>monthly</changefreq>
          <priority>0.8</priority>
        </url>
        <url>
          <loc>`+API_URL+`/privacy-policy</loc>
          <changefreq>monthly</changefreq>
          <priority>0.8</priority>
        </url>
        <url>
          <loc>`+API_URL+`/404</loc>
          <changefreq>monthly</changefreq>
          <priority>0.8</priority>
        </url>
        <url>
          <loc>`+API_URL+`/thank-you</loc>
          <changefreq>monthly</changefreq>
          <priority>0.8</priority>
        </url>
        <url>
          <loc>`+API_URL+`/signup</loc>
          <changefreq>monthly</changefreq>
          <priority>0.8</priority>
        </url>
        <url>
          <loc>`+API_URL+`/login</loc>
          <changefreq>monthly</changefreq>
          <priority>0.8</priority>
        </url>
        <url>
          <loc>`+API_URL+`/thankyou</loc>
          <changefreq>monthly</changefreq>
          <priority>0.8</priority>
        </url>
        <url>
          <loc>`+API_URL+`/blog</loc>
          <changefreq>monthly</changefreq>
          <priority>0.8</priority>
        </url>
      `;

      // Dynamic Routes
      routes.forEach((route: any) => {
        const url =
          URL+`routes/` +
          `${route.source_slug}-` +
          `${route.destination_slug}-bus-services`;

        xml += `
          <url>
            <loc>${url}</loc>
            <changefreq>daily</changefreq>
            <priority>0.8</priority>
          </url>
        `;
      });

      // Dynamic Operators
      operators.forEach((operator: any) => {
        const operatorUrl =
          URL+`operators/` +
          `${operator.operator_url}`;

        xml += `
          <url>
            <loc>${operatorUrl}</loc>
            <changefreq>daily</changefreq>
            <priority>0.8</priority>
          </url>
        `;
      });

      xml += `</urlset>`;

      res.setHeader('Content-Type', 'application/xml');
      res.send(xml);
    } catch (error) {
      console.error('Sitemap Error:', error);
      res.status(500).send('Error generating sitemap');
    }
  });
  // Add sitemap.xml code here

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine(
    'html',
    ngExpressEngine({
      bootstrap: AppServerModule,
      inlineCriticalCss: false,
    }),
  );

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  server.use((req, _res, next) => {
    if (req.path === '/index.php' || req.path === '/index.html') {
      req.url = req.url.replace(/^\/index\.(php|html)/, '/') || '/';
    }

    next();
  });

  // Serve static files from /browser
  server.get(
    '*.*',
    express.static(distFolder, {
      maxAge: '1y',
      immutable: true,
    }),
    (req, res) => {
      res.status(404).send(`Asset not found: ${req.url}`);
    },
  );

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    // =========================================
    // PREVENT SSR HTML PAGE CACHING
    // =========================================
    res.setHeader(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate',
    );

    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');

    // Optional security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');

    res.render(
      indexHtml,
      {
        req,
        providers: [
          { provide: APP_BASE_HREF, useValue: req.baseUrl || '/' },
          { provide: REQUEST, useValue: req },
        ],
      },
      (err: Error, html: string) => {
        if (err) {
          console.error('========================================');
          console.error('SSR RENDERING ERROR:');
          console.error('Error message:', err.message);
          console.error('Error name:', err.name);
          console.error('Stack trace:', err.stack);
          console.error('========================================');
          // Don't fallback silently - show the error to help debug
          // Fallback to client-side rendering if SSR fails
          const fs = require('fs');
          const indexPath = join(distFolder, 'index.html');
          if (existsSync(indexPath)) {
            console.warn('Falling back to static HTML due to SSR error');
            const indexContent = fs.readFileSync(indexPath, 'utf8');
            return res.send(indexContent);
          }
          return res
            .status(500)
            .send('SSR Error: ' + err.message + '\n\nStack: ' + err.stack);
        }
        // Log successful SSR rendering
        console.log('SSR rendering successful for:', req.url);
        res.send(html);
      },
    );
  });

  return server;
}

function run(): void {
  const port = process.env.PORT || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = (mainModule && mainModule.filename) || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';

/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroQuoteParser from './parsers/hero-quote.js';
import columnsCategoryParser from './parsers/columns-category.js';
import cardsCoverageParser from './parsers/cards-coverage.js';
import columnsAgentCtaParser from './parsers/columns-agent-cta.js';
import cardsArticleParser from './parsers/cards-article.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/statefarm-cleanup.js';
import sectionsTransformer from './transformers/statefarm-sections.js';

// PAGE TEMPLATE CONFIGURATION - embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'insurance-hub',
  description: 'Insurance category hub/landing page.',
  urls: [
    'https://www.statefarm.com/insurance',
  ],
  blocks: [
    {
      name: 'hero-quote',
      instances: ['#__next > main > section.west.general_overflow___oFWQ.-w_pt-48'],
    },
    {
      name: 'columns-category',
      instances: [
        '#__next > main > section.west.general_overflow___oFWQ.-w_mt-64',
        '#__next > main > section.west.general_overflow___oFWQ.-w_mt-48',
      ],
    },
    {
      name: 'cards-coverage',
      instances: ['.general_grid-wrapper__bjQyF'],
    },
    {
      name: 'columns-agent-cta',
      instances: ['#find-agent .findAgentStyles_color_container__vEsF5'],
    },
    {
      name: 'cards-article',
      instances: ['#__next > main > section.west.-w_mt-88.-w_mt-sm-96.-w_mt-md-104.-w_mt-lg-112.-w_mt-xl-120 > div.-oneX-container > div.-oneX-row'],
    },
  ],
  sections: [
    { id: 'rc3', name: 'Hero with quote form', selector: '#__next > main > section.west.general_overflow___oFWQ.-w_pt-48', style: null, blocks: ['hero-quote'], defaultContent: [] },
    { id: 'rc5', name: 'Vehicle insurance category row', selector: '#__next > main > section.west.general_overflow___oFWQ.-w_mt-64', style: null, blocks: ['columns-category', 'cards-coverage'], defaultContent: [] },
    { id: 'rc7', name: 'Home & property insurance category row', selector: '#__next > main > section.west.general_overflow___oFWQ.-w_mt-48:nth-of-type(5)', style: null, blocks: ['columns-category', 'cards-coverage'], defaultContent: [] },
    { id: 'rc9', name: 'Personal insurance category row', selector: '#__next > main > section.west.general_overflow___oFWQ.-w_mt-48:nth-of-type(7)', style: null, blocks: ['columns-category', 'cards-coverage'], defaultContent: [] },
    { id: 'rc11', name: 'Small business insurance category row', selector: '#__next > main > section.west.general_overflow___oFWQ.-w_mt-48:nth-of-type(9)', style: null, blocks: ['columns-category', 'cards-coverage'], defaultContent: [] },
    { id: 'rc12', name: 'Find-an-agent CTA', selector: '#find-agent', style: null, blocks: ['columns-agent-cta'], defaultContent: [] },
    { id: 'rc13', name: 'Simple Insights article grid', selector: '#__next > main > section.west.-w_mt-88.-w_mt-sm-96.-w_mt-md-104.-w_mt-lg-112.-w_mt-xl-120', style: null, blocks: ['cards-article'], defaultContent: [] },
    { id: 'rc15', name: 'Disclosures / footnotes', selector: '#__next > main > section.west.disclosure', style: null, blocks: [], defaultContent: [] },
  ],
};

// PARSER REGISTRY
const parsers = {
  'hero-quote': heroQuoteParser,
  'columns-category': columnsCategoryParser,
  'cards-coverage': cardsCoverageParser,
  'columns-agent-cta': columnsAgentCtaParser,
  'cards-article': cardsArticleParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};

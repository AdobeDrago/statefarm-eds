/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroQuoteParser from './parsers/hero-quote.js';
import columnsSubnavParser from './parsers/columns-subnav.js';
import columnsCategoryParser from './parsers/columns-category.js';
import columnsAgentCtaParser from './parsers/columns-agent-cta.js';
import cardsCoverageParser from './parsers/cards-coverage.js';
import cardsChecklistParser from './parsers/cards-checklist.js';
import accordionFaqParser from './parsers/accordion-faq.js';
import cardsArticleParser from './parsers/cards-article.js';
import columnsPromoParser from './parsers/columns-promo.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/statefarm-cleanup.js';
import sectionsTransformer from './transformers/statefarm-sections.js';

// PAGE TEMPLATE CONFIGURATION - embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'insurance-product',
  description: 'Insurance product detail page.',
  urls: [
    'https://www.statefarm.com/insurance/auto',
    'https://www.statefarm.com/insurance/homeowners',
  ],
  blocks: [
    { name: 'hero-quote', instances: ['#masthead-a', '#masthead'] },
    { name: 'columns-subnav', instances: ['#subnav > div.-oneX-container', '#subnav'] },
    { name: 'columns-category', instances: ['#fit-your-needs > div.-oneX-container > div.-oneX-row:nth-of-type(2)', '#drive-safe-steer > div.-oneX-container'] },
    { name: 'columns-agent-cta', instances: ['#bundle .-oneX-container', '#find-agent .findAgentStyles_color_container__vEsF5', '#find-agent .-oneX-container'] },
    { name: 'cards-coverage', instances: ['#why-choose > div.-oneX-container > div.-oneX-row:nth-of-type(2)', '#need-something-more > div.-oneX-container > div.-oneX-row:nth-of-type(2)', '#additional-vehicle > div.-oneX-container > div.-oneX-row:nth-of-type(2)', '#additional-insurance > div.-oneX-container > div.-oneX-row:nth-of-type(2)'] },
    { name: 'cards-checklist', instances: ['#what-do-i-need > div.-oneX-container > div.-oneX-row:nth-of-type(2)', '#types > div.-oneX-container'] },
    { name: 'accordion-faq', instances: ['#panels'] },
    { name: 'cards-article', instances: ['#__next > main > section.west:nth-of-type(12) > div.-oneX-container > div.-oneX-row', '#simple-insights .simpleInsightsSectionStyles_image-link_container-outer__Gl3Th'] },
    { name: 'columns-promo', instances: ['#ting > div.-oneX-container'] },
  ],
  sections: [
    { id: 'rc4', name: 'Masthead hero with quote form', selector: ['#masthead-a', '#masthead'], style: null, blocks: ['hero-quote'], defaultContent: [] },
    { id: 'rc5', name: 'Sticky sub-navigation', selector: '#subnav', style: 'grey', blocks: ['columns-subnav'], defaultContent: [] },
    { id: 'rc6', name: 'Fit your needs', selector: '#fit-your-needs', style: null, blocks: ['columns-category'], defaultContent: ['#fit-your-needs > div.-oneX-container > div.-oneX-row:nth-of-type(1)'] },
    { id: 'rc7', name: 'Bundle CTA', selector: '#bundle', style: 'accent', blocks: ['columns-agent-cta'], defaultContent: [] },
    { id: 'rc8', name: 'Drive Safe Steer Clear', selector: '#drive-safe-steer', style: null, blocks: ['columns-category'], defaultContent: [] },
    { id: 'rc9', name: 'Why choose grid', selector: '#why-choose', style: null, blocks: ['cards-coverage'], defaultContent: ['#why-choose > div.-oneX-container > div.-oneX-row:nth-of-type(1)'] },
    { id: 'rc10', name: 'Specific needs grid', selector: '#need-something-more', style: null, blocks: ['cards-coverage'], defaultContent: ['#need-something-more > div.-oneX-container > div.-oneX-row:nth-of-type(1)'] },
    { id: 'rc11', name: 'What do I need checklists', selector: '#what-do-i-need', style: null, blocks: ['cards-checklist'], defaultContent: ['#what-do-i-need > div.-oneX-container > div.-oneX-row:nth-of-type(1)'] },
    { id: 'rc12', name: 'FAQ accordion', selector: '#faq', style: null, blocks: ['accordion-faq'], defaultContent: ['#faq > div.-oneX-container > div.-oneX-row:nth-of-type(1)'] },
    { id: 'rc13', name: 'Find-an-agent CTA', selector: '#find-agent', style: null, blocks: ['columns-agent-cta'], defaultContent: [] },
    { id: 'rc14', name: 'Additional vehicle grid', selector: '#additional-vehicle', style: null, blocks: ['cards-coverage'], defaultContent: ['#additional-vehicle > div.-oneX-container > div.-oneX-row:nth-of-type(1)'] },
    { id: 'rc15', name: 'Simple Insights article grid', selector: ['#__next > main > section.west:nth-of-type(12)', '#simple-insights'], style: null, blocks: ['cards-article'], defaultContent: [] },
    { id: 'rc17', name: 'Disclosures', selector: ['#disclosures', '#disclosure'], style: null, blocks: [], defaultContent: [] },
    { id: 'gap-types', name: 'Homeowners what-you-need checklists', selector: '#types', style: null, blocks: ['cards-checklist'], defaultContent: ['#types > div.-oneX-container > div.-oneX-row:nth-of-type(1)'] },
    { id: 'gap-ting', name: 'Ting partner promo', selector: '#ting', style: null, blocks: ['columns-promo'], defaultContent: [] },
  ],
};

// PARSER REGISTRY
const parsers = {
  'hero-quote': heroQuoteParser,
  'columns-subnav': columnsSubnavParser,
  'columns-category': columnsCategoryParser,
  'columns-agent-cta': columnsAgentCtaParser,
  'cards-coverage': cardsCoverageParser,
  'cards-checklist': cardsChecklistParser,
  'accordion-faq': accordionFaqParser,
  'cards-article': cardsArticleParser,
  'columns-promo': columnsPromoParser,
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
  const seen = new Set();
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        if (seen.has(element)) return;
        seen.add(element);
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

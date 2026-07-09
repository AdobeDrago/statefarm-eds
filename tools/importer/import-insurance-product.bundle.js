/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-insurance-product.js
  var import_insurance_product_exports = {};
  __export(import_insurance_product_exports, {
    default: () => import_insurance_product_default
  });

  // tools/importer/parsers/hero-quote.js
  function parse(element, { document }) {
    const heading = element.querySelector('h1, h2, [class*="heading"]');
    const intro = element.querySelector("p.-oneX-body--intro-sm, .-oneX-body--intro-sm, :scope p");
    const image = element.querySelector('picture img, img[class*="hero-img"], img');
    if (!heading && !intro && !image) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (image) {
      cells.push([image]);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (intro) contentCell.push(intro);
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-quote", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-subnav.js
  function parse2(element, { document }) {
    const exploreList = element.querySelector('ul.-oneX-subnav-explore, [class*="subnav-explore"], ul');
    const linkEls = [];
    if (exploreList) {
      exploreList.querySelectorAll("li").forEach((li) => {
        const a = li.querySelector("a[href]");
        if (a) {
          linkEls.push(a);
        } else {
          const span = li.querySelector("span, a");
          if (span && span.textContent.trim()) {
            const p = document.createElement("p");
            p.textContent = span.textContent.trim();
            linkEls.push(p);
          }
        }
      });
    }
    if (linkEls.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const contentCell = [];
    linkEls.forEach((el) => {
      if (el.tagName === "A") {
        const p = document.createElement("p");
        p.appendChild(el);
        contentCell.push(p);
      } else {
        contentCell.push(el);
      }
    });
    const cells = [];
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-subnav", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-category.js
  function parse3(element, { document }) {
    let image = element.querySelector('picture img, img[class*="vehicle-img"], img[class*="hero-img"], img');
    if (image && image.closest('[class*="grid-wrapper"], [class*="grid-item"]')) {
      image = null;
    }
    const heading = element.querySelector('h2, h3, [class*="heading"]');
    let description = null;
    if (heading) {
      const textCol = heading.closest("div");
      if (textCol) {
        description = textCol.querySelector(":scope > p");
      }
    }
    if (!description) {
      const p = element.querySelector("p");
      if (p && !p.closest('[class*="grid-wrapper"], [class*="grid-item"]')) {
        description = p;
      }
    }
    if (!heading && !image && !description) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const imageCell = [];
    if (image) imageCell.push(image);
    const textCell = [];
    if (heading) textCell.push(heading);
    if (description) textCell.push(description);
    const cells = [];
    cells.push([
      imageCell.length ? imageCell : "",
      textCell.length ? textCell : ""
    ]);
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-category", cells });
    const grid = element.querySelector('[class*="grid-wrapper"]');
    if (grid) {
      const introRow = heading ? heading.closest(".-oneX-row") : null;
      element.prepend(block);
      if (introRow && introRow !== block && !introRow.contains(grid)) {
        introRow.remove();
      }
    } else {
      element.replaceWith(block);
    }
  }

  // tools/importer/parsers/columns-agent-cta.js
  function parse4(element, { document }) {
    const heading = element.querySelector('h2, h3, [class*="typography-variant"], [class*="heading"]');
    let copy = null;
    const paras = element.querySelectorAll("p");
    for (const p of paras) {
      if (!p.closest("form")) {
        copy = p;
        break;
      }
    }
    const image = element.querySelector('[class*="agent_container"] img, [class*="agent_img"], picture img, img');
    if (!heading && !copy && !image) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const textCell = [];
    if (heading) textCell.push(heading);
    if (copy) textCell.push(copy);
    const imageCell = [];
    if (image) imageCell.push(image);
    const cells = [];
    cells.push([
      textCell.length ? textCell : "",
      imageCell.length ? imageCell : ""
    ]);
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-agent-cta", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-coverage.js
  function parse5(element, { document }) {
    let items = Array.from(element.querySelectorAll('[class*="grid-item"]'));
    if (items.length === 0) {
      items = Array.from(element.querySelectorAll(":scope > div")).filter((d) => d.querySelector("h3, h4, h5, h6"));
    }
    if (items.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    items.forEach((item) => {
      const cardContent = [];
      const heading = item.querySelector('h3, h4, h5, h6, [class*="title"]');
      if (heading) cardContent.push(heading);
      item.querySelectorAll(":scope > p, p").forEach((p) => {
        if (!cardContent.includes(p)) cardContent.push(p);
      });
      if (cardContent.length) {
        cells.push([cardContent]);
      }
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-coverage", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-checklist.js
  function parse6(element, { document }) {
    let cards = Array.from(element.querySelectorAll("div")).filter((d) => d.querySelector(":scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6") && d.querySelector(":scope > ul"));
    cards = cards.filter((d) => !cards.some((other) => other !== d && d.contains(other)));
    if (cards.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cards.forEach((card) => {
      const cardContent = [];
      const heading = card.querySelector(":scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6");
      if (heading) cardContent.push(heading);
      const list = card.querySelector(":scope > ul");
      if (list) cardContent.push(list);
      const footnote = card.querySelector(":scope > p");
      if (footnote) cardContent.push(footnote);
      if (cardContent.length) {
        cells.push([cardContent]);
      }
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-checklist", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse7(element, { document }) {
    const panels = Array.from(element.querySelectorAll('.-oneX-panel--expansion, [class*="panel--expansion"]'));
    if (panels.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    panels.forEach((panel) => {
      const control = panel.querySelector('.-oneX-panel-control, [role="heading"], [class*="panel-control"]');
      let titleEl = panel.querySelector('.-oneX-panel-button, button, [class*="panel-button"]');
      let titleCell = "";
      if (titleEl && titleEl.textContent.trim()) {
        const h = document.createElement("h3");
        h.textContent = titleEl.textContent.trim();
        titleCell = [h];
      } else if (control && control.textContent.trim()) {
        const h = document.createElement("h3");
        h.textContent = control.textContent.trim();
        titleCell = [h];
      }
      const content = panel.querySelector('.-oneX-panel-content, [class*="panel-content"]');
      let contentCell = "";
      if (content) {
        const nodes = Array.from(content.children).filter((c) => c.textContent.trim() || c.querySelector("img"));
        if (nodes.length) contentCell = nodes;
      }
      if (titleCell || contentCell) {
        cells.push([titleCell || "", contentCell || ""]);
      }
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse8(element, { document }) {
    let cards = Array.from(element.querySelectorAll('[class*="-oneX-col"]')).filter((col) => col.querySelector("img") && col.querySelector("a"));
    if (cards.length === 0) {
      cards = Array.from(element.querySelectorAll('[class*="image-link_container"]')).filter((c) => c.querySelector("img") && c.querySelector("a"));
    }
    if (cards.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cards.forEach((card) => {
      const image = card.querySelector("picture img, img");
      let titleLink = card.querySelector('a[class*="link--block"], a[class*="link-secondary"]');
      if (!titleLink) {
        titleLink = Array.from(card.querySelectorAll("a")).find((a) => !a.querySelector("img"));
      }
      const textCell = [];
      if (titleLink) textCell.push(titleLink);
      const desc = card.querySelector("p");
      if (desc) textCell.push(desc);
      if (image || textCell.length) {
        cells.push([
          image ? [image] : "",
          textCell.length ? textCell : ""
        ]);
      }
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-promo.js
  function parse9(element, { document }) {
    const heading = element.querySelector('h2, h3, h4, [class*="heading"]');
    const contentCol = heading ? heading.closest('[class*="-oneX-col"]') : null;
    let logo = null;
    if (contentCol) {
      logo = contentCol.querySelector("img");
    }
    const copy = element.querySelector("p");
    const cta = element.querySelector('a[class*="btn"], a[role="button"], a[class*="anchor"]');
    let productImg = null;
    const pics = Array.from(element.querySelectorAll("picture img"));
    productImg = pics.find((img) => !contentCol || !contentCol.contains(img)) || null;
    if (!productImg) {
      productImg = Array.from(element.querySelectorAll("img")).find((img) => img !== logo && (!contentCol || !contentCol.contains(img))) || null;
    }
    if (!heading && !copy && !logo && !productImg) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const textCell = [];
    if (logo) textCell.push(logo);
    if (heading) textCell.push(heading);
    if (copy) textCell.push(copy);
    if (cta) textCell.push(cta);
    const imageCell = [];
    if (productImg) imageCell.push(productImg);
    const cells = [];
    cells.push([
      textCell.length ? textCell : "",
      imageCell.length ? imageCell : ""
    ]);
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/statefarm-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#thirdPartyLinkModal",
        ".-oneX-modal__container"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#oneX-header",
        "header#oneX-header",
        "#footer",
        "footer#footer",
        ".-oneX-header-spacer",
        "section.-oneX-breadcrumbs",
        ".-oneX-breadcrumbs",
        "a.-oneX-skip-content",
        'a[href="#maincontent"]',
        "#give-us-feedback",
        '[class*="give-us-feedback"]',
        // Leftover non-authorable / non-rendering elements.
        "iframe",
        "noscript",
        "link",
        "style"
      ]);
      element.querySelectorAll("a, p").forEach((el) => {
        const text = (el.textContent || "").trim().toLowerCase();
        if (text === "skip to main content" || text === "start of main content") {
          el.remove();
        }
      });
    }
  }

  // tools/importer/transformers/statefarm-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  var MAIN_PREFIX_RE = /^\s*#__next\s*>\s*main\s*>\s*/i;
  function tryQuery(scope, sel) {
    if (!scope || !sel) return null;
    try {
      return scope.querySelector(sel);
    } catch (e) {
      return null;
    }
  }
  function resolveSectionElement(root, selector) {
    const selectors = Array.isArray(selector) ? selector : [selector];
    const doc = root.ownerDocument;
    for (const sel of selectors) {
      if (!sel) continue;
      let el = tryQuery(root, sel);
      if (el) return el;
      if (MAIN_PREFIX_RE.test(sel)) {
        const child = sel.replace(MAIN_PREFIX_RE, "");
        el = tryQuery(root, `:scope > ${child}`);
        if (el) return el;
        el = tryQuery(root, child);
        if (el) return el;
      }
      if (doc) {
        el = tryQuery(doc, sel);
        if (el) return el;
      }
    }
    return null;
  }
  function transform2(hookName, element, payload) {
    if (hookName !== TransformHook2.afterTransform) return;
    const template = payload && payload.template;
    const sections = template && template.sections;
    if (!sections || sections.length < 2) return;
    const doc = element.ownerDocument;
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      const sectionEl = resolveSectionElement(element, section.selector);
      if (!sectionEl) continue;
      if (section.style) {
        const metadataBlock = WebImporter.Blocks.createBlock(doc, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        sectionEl.after(metadataBlock);
      }
      if (i > 0) {
        const hr = doc.createElement("hr");
        sectionEl.before(hr);
      }
    }
  }

  // tools/importer/import-insurance-product.js
  var PAGE_TEMPLATE = {
    name: "insurance-product",
    description: "Insurance product detail page.",
    urls: [
      "https://www.statefarm.com/insurance/auto",
      "https://www.statefarm.com/insurance/homeowners"
    ],
    blocks: [
      { name: "hero-quote", instances: ["#masthead-a", "#masthead"] },
      { name: "columns-subnav", instances: ["#subnav > div.-oneX-container", "#subnav"] },
      { name: "columns-category", instances: ["#fit-your-needs > div.-oneX-container > div.-oneX-row:nth-of-type(2)", "#drive-safe-steer > div.-oneX-container"] },
      { name: "columns-agent-cta", instances: ["#bundle .-oneX-container", "#find-agent .findAgentStyles_color_container__vEsF5", "#find-agent .-oneX-container"] },
      { name: "cards-coverage", instances: ["#why-choose > div.-oneX-container > div.-oneX-row:nth-of-type(2)", "#need-something-more > div.-oneX-container > div.-oneX-row:nth-of-type(2)", "#additional-vehicle > div.-oneX-container > div.-oneX-row:nth-of-type(2)", "#additional-insurance > div.-oneX-container > div.-oneX-row:nth-of-type(2)"] },
      { name: "cards-checklist", instances: ["#what-do-i-need > div.-oneX-container > div.-oneX-row:nth-of-type(2)", "#types > div.-oneX-container"] },
      { name: "accordion-faq", instances: ["#panels"] },
      { name: "cards-article", instances: ["#__next > main > section.west:nth-of-type(12) > div.-oneX-container > div.-oneX-row", "#simple-insights .simpleInsightsSectionStyles_image-link_container-outer__Gl3Th"] },
      { name: "columns-promo", instances: ["#ting > div.-oneX-container"] }
    ],
    sections: [
      { id: "rc4", name: "Masthead hero with quote form", selector: ["#masthead-a", "#masthead"], style: null, blocks: ["hero-quote"], defaultContent: [] },
      { id: "rc5", name: "Sticky sub-navigation", selector: "#subnav", style: "grey", blocks: ["columns-subnav"], defaultContent: [] },
      { id: "rc6", name: "Fit your needs", selector: "#fit-your-needs", style: null, blocks: ["columns-category"], defaultContent: ["#fit-your-needs > div.-oneX-container > div.-oneX-row:nth-of-type(1)"] },
      { id: "rc7", name: "Bundle CTA", selector: "#bundle", style: "accent", blocks: ["columns-agent-cta"], defaultContent: [] },
      { id: "rc8", name: "Drive Safe Steer Clear", selector: "#drive-safe-steer", style: null, blocks: ["columns-category"], defaultContent: [] },
      { id: "rc9", name: "Why choose grid", selector: "#why-choose", style: null, blocks: ["cards-coverage"], defaultContent: ["#why-choose > div.-oneX-container > div.-oneX-row:nth-of-type(1)"] },
      { id: "rc10", name: "Specific needs grid", selector: "#need-something-more", style: null, blocks: ["cards-coverage"], defaultContent: ["#need-something-more > div.-oneX-container > div.-oneX-row:nth-of-type(1)"] },
      { id: "rc11", name: "What do I need checklists", selector: "#what-do-i-need", style: null, blocks: ["cards-checklist"], defaultContent: ["#what-do-i-need > div.-oneX-container > div.-oneX-row:nth-of-type(1)"] },
      { id: "rc12", name: "FAQ accordion", selector: "#faq", style: null, blocks: ["accordion-faq"], defaultContent: ["#faq > div.-oneX-container > div.-oneX-row:nth-of-type(1)"] },
      { id: "rc13", name: "Find-an-agent CTA", selector: "#find-agent", style: null, blocks: ["columns-agent-cta"], defaultContent: [] },
      { id: "rc14", name: "Additional vehicle grid", selector: "#additional-vehicle", style: null, blocks: ["cards-coverage"], defaultContent: ["#additional-vehicle > div.-oneX-container > div.-oneX-row:nth-of-type(1)"] },
      { id: "rc15", name: "Simple Insights article grid", selector: ["#__next > main > section.west:nth-of-type(12)", "#simple-insights"], style: null, blocks: ["cards-article"], defaultContent: [] },
      { id: "rc17", name: "Disclosures", selector: ["#disclosures", "#disclosure"], style: null, blocks: [], defaultContent: [] },
      { id: "gap-types", name: "Homeowners what-you-need checklists", selector: "#types", style: null, blocks: ["cards-checklist"], defaultContent: ["#types > div.-oneX-container > div.-oneX-row:nth-of-type(1)"] },
      { id: "gap-ting", name: "Ting partner promo", selector: "#ting", style: null, blocks: ["columns-promo"], defaultContent: [] }
    ]
  };
  var parsers = {
    "hero-quote": parse,
    "columns-subnav": parse2,
    "columns-category": parse3,
    "columns-agent-cta": parse4,
    "cards-coverage": parse5,
    "cards-checklist": parse6,
    "accordion-faq": parse7,
    "cards-article": parse8,
    "columns-promo": parse9
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
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
    const seen = /* @__PURE__ */ new Set();
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_insurance_product_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_insurance_product_exports);
})();

/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: State Farm section breaks and section metadata.
 *
 * Both State Farm templates (insurance-hub, insurance-product) define 2+
 * sections in page-templates.json, so section handling is required.
 *
 * For each section defined on the matched template (processed in reverse
 * document order so earlier insertions don't shift later ones):
 *   - Insert a Section Metadata block after the section when it has a `style`
 *     (e.g. the product template's "grey" subnav and "accent" bundle CTA).
 *   - Insert an <hr> before the section for every section except the first,
 *     to create the section boundary EDS expects.
 *
 * Section selectors come from `payload.template.sections[].selector`. Some
 * sections use a single CSS string, others an array of fallback selectors
 * (e.g. ["#masthead-a", "#masthead"] across the auto/homeowners variants);
 * both forms are supported. Selectors were populated from the captured DOM by
 * the site-analysis / block-mapping workflow.
 *
 * `element` here is the page's <main>. Several hub selectors are rooted at the
 * document (`#__next > main > section.west...`); those ancestors are not
 * descendants of `main`, so a plain `main.querySelector('#__next > main > ...')`
 * never matches. resolveSectionElement handles this by trying, in order:
 *   1. the selector as-is scoped to `main` (covers id-based selectors that live
 *      inside main, e.g. `#subnav`, `#find-agent`);
 *   2. the selector with a leading `#__next > main >` prefix stripped and
 *      re-scoped to `main` via `:scope >` (turns the absolute path into a
 *      direct-child match under main);
 *   3. a document-level query, in case the injected fixture keeps the full
 *      `#__next > main` ancestry above the passed-in element.
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

const MAIN_PREFIX_RE = /^\s*#__next\s*>\s*main\s*>\s*/i;

function tryQuery(scope, sel) {
  if (!scope || !sel) return null;
  try {
    return scope.querySelector(sel);
  } catch (e) {
    // Skip malformed selector rather than aborting the whole transform.
    return null;
  }
}

function resolveSectionElement(root, selector) {
  const selectors = Array.isArray(selector) ? selector : [selector];
  const doc = root.ownerDocument;
  for (const sel of selectors) {
    if (!sel) continue;

    // 1. As-is, scoped to main.
    let el = tryQuery(root, sel);
    if (el) return el;

    // 2. Strip the `#__next > main >` document prefix and match as a direct
    //    child of main.
    if (MAIN_PREFIX_RE.test(sel)) {
      const child = sel.replace(MAIN_PREFIX_RE, '');
      el = tryQuery(root, `:scope > ${child}`);
      if (el) return el;
      el = tryQuery(root, child);
      if (el) return el;
    }

    // 3. Document-level fallback (full ancestry preserved above `element`).
    if (doc) {
      el = tryQuery(doc, sel);
      if (el) return el;
    }
  }
  return null;
}

export default function transform(hookName, element, payload) {
  if (hookName !== TransformHook.afterTransform) return;

  const template = payload && payload.template;
  const sections = template && template.sections;
  if (!sections || sections.length < 2) return;

  const doc = element.ownerDocument;

  // Process in reverse so DOM insertions don't invalidate the position of
  // sections we haven't handled yet.
  for (let i = sections.length - 1; i >= 0; i -= 1) {
    const section = sections[i];
    const sectionEl = resolveSectionElement(element, section.selector);
    if (!sectionEl) continue;

    // Section Metadata block for styled sections, inserted after the section.
    if (section.style) {
      const metadataBlock = WebImporter.Blocks.createBlock(doc, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      sectionEl.after(metadataBlock);
    }

    // Section break before every section except the first.
    if (i > 0) {
      const hr = doc.createElement('hr');
      sectionEl.before(hr);
    }
  }
}

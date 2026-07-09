/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq. Base: accordion.
 * Source: State Farm FAQ accordion (#panels, -oneX-panel--expansion items).
 *
 * Library structure (Accordion): 2 columns, multiple rows.
 *   Row 1: block name
 *   Each subsequent row = one accordion item as 2 cells:
 *     Cell 1: Title (the clickable question)
 *     Cell 2: Content (the answer body — paragraphs, lists, links)
 */
export default function parse(element, { document }) {
  const panels = Array.from(element.querySelectorAll('.-oneX-panel--expansion, [class*="panel--expansion"]'));

  // Empty-block guard
  if (panels.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  panels.forEach((panel) => {
    // Question: the button text inside the panel control
    const control = panel.querySelector('.-oneX-panel-control, [role="heading"], [class*="panel-control"]');
    let titleEl = panel.querySelector('.-oneX-panel-button, button, [class*="panel-button"]');

    // Build a clean title element (avoid pulling in chevron icons)
    let titleCell = '';
    if (titleEl && titleEl.textContent.trim()) {
      const h = document.createElement('h3');
      h.textContent = titleEl.textContent.trim();
      titleCell = [h];
    } else if (control && control.textContent.trim()) {
      const h = document.createElement('h3');
      h.textContent = control.textContent.trim();
      titleCell = [h];
    }

    // Answer: the panel content body (preserve paragraphs, lists, links)
    const content = panel.querySelector('.-oneX-panel-content, [class*="panel-content"]');
    let contentCell = '';
    if (content) {
      const nodes = Array.from(content.children).filter((c) => c.textContent.trim() || c.querySelector('img'));
      if (nodes.length) contentCell = nodes;
    }

    if (titleCell || contentCell) {
      // 2-column accordion row: title | content
      cells.push([titleCell || '', contentCell || '']);
    }
  });

  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}

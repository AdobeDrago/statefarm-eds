/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-coverage. Base: cards (no images variant).
 * Source: State Farm coverage-link grids (general_grid-wrapper / grid-item).
 *
 * Library structure (Cards, no images): 1 column, multiple rows.
 *   Row 1: block name
 *   Each subsequent row = one card, single cell containing:
 *     Heading (H5 title) + description paragraph (with linked coverage phrase)
 *
 * These cards are text-only (no image), so the single-column "no images"
 * shape applies.
 */
export default function parse(element, { document }) {
  // Each grid-item is a card. Fall back to direct heading-bearing children.
  let items = Array.from(element.querySelectorAll('[class*="grid-item"]'));
  if (items.length === 0) {
    // Fallback: treat direct child divs that contain a heading as cards
    items = Array.from(element.querySelectorAll(':scope > div'))
      .filter((d) => d.querySelector('h3, h4, h5, h6'));
  }

  // Empty-block guard
  if (items.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  items.forEach((item) => {
    const cardContent = [];
    const heading = item.querySelector('h3, h4, h5, h6, [class*="title"]');
    if (heading) cardContent.push(heading);
    // Description paragraph(s) — preserve the linked coverage phrase
    item.querySelectorAll(':scope > p, p').forEach((p) => {
      if (!cardContent.includes(p)) cardContent.push(p);
    });
    if (cardContent.length) {
      // 1-column card row: one cell holding all card content
      cells.push([cardContent]);
    }
  });

  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-coverage', cells });
  element.replaceWith(block);
}

/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-article. Base: cards.
 * Source: State Farm "Simple Insights" article grids.
 *
 * Library structure (Cards): 2 columns, multiple rows.
 *   Row 1: block name
 *   Each subsequent row = one card:
 *     Cell 1: thumbnail image (mandatory)
 *     Cell 2: text — linked article title (+ optional description on product pages)
 *
 * The instance selector targets the card row (div.-oneX-row). We locate the
 * column cells whether the element is the row itself or a wrapping section.
 */
export default function parse(element, { document }) {
  // Candidate card columns: each -oneX-col that contains an image + link.
  let cards = Array.from(element.querySelectorAll('[class*="-oneX-col"]'))
    .filter((col) => col.querySelector('img') && col.querySelector('a'));

  // Fallback: article image-link containers (simple-insights outer variant)
  if (cards.length === 0) {
    cards = Array.from(element.querySelectorAll('[class*="image-link_container"]'))
      .filter((c) => c.querySelector('img') && c.querySelector('a'));
  }

  // Empty-block guard
  if (cards.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  cards.forEach((card) => {
    const image = card.querySelector('picture img, img');
    // Article title link (block-styled link). Prefer a link that is not inside the image.
    let titleLink = card.querySelector('a[class*="link--block"], a[class*="link-secondary"]');
    if (!titleLink) {
      titleLink = Array.from(card.querySelectorAll('a'))
        .find((a) => !a.querySelector('img'));
    }

    const textCell = [];
    if (titleLink) textCell.push(titleLink);
    // Optional description paragraph (product pages)
    const desc = card.querySelector('p');
    if (desc) textCell.push(desc);

    if (image || textCell.length) {
      // 2-column card row: image | text (pad empties to keep column count equal)
      cells.push([
        image ? [image] : '',
        textCell.length ? textCell : '',
      ]);
    }
  });

  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}

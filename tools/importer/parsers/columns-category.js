/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-category. Base: columns.
 * Source: https://www.statefarm.com/insurance (category rows) and product pages.
 *
 * Library structure (Columns): first row = block name, subsequent rows have
 * matching column counts; each cell becomes a responsive column.
 *
 * This variant is a 2-column informational row:
 *   Col 1: supporting image
 *   Col 2: heading + description copy (may contain inline links / CTA link)
 *
 * On the hub the image/text sides alternate visually, but the authoring model
 * keeps image in col 1 and text in col 2 (CSS handles alternating). The separate
 * coverage-link grid (general_grid-wrapper) is a distinct cards-coverage block
 * and is intentionally excluded here.
 */
export default function parse(element, { document }) {
  // Image column: the picture/image that is NOT inside the coverage grid
  let image = element.querySelector('picture img, img[class*="vehicle-img"], img[class*="hero-img"], img');
  if (image && image.closest('[class*="grid-wrapper"], [class*="grid-item"]')) {
    image = null;
  }

  // Text column: heading + its following description paragraph.
  const heading = element.querySelector('h2, h3, [class*="heading"]');

  // Description paragraph — the intro copy sibling of the heading, NOT the
  // short paragraphs inside the coverage grid items.
  let description = null;
  if (heading) {
    const textCol = heading.closest('div');
    if (textCol) {
      description = textCol.querySelector(':scope > p');
    }
  }
  if (!description) {
    const p = element.querySelector('p');
    if (p && !p.closest('[class*="grid-wrapper"], [class*="grid-item"]')) {
      description = p;
    }
  }

  // Empty-block guard
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
  // 2-column content row: image | text (pad with '' if a side is empty)
  cells.push([
    imageCell.length ? imageCell : '',
    textCell.length ? textCell : '',
  ]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-category', cells });

  // On the hub, the instance selector is the whole category-row <section>, which
  // also contains a sibling coverage-link grid (parsed separately as cards-coverage).
  // Replacing the entire section would detach that grid before cards-coverage runs.
  // When a grid is present, replace only the consumed intro row and leave the grid
  // in place; otherwise replace the whole element (product-page rows have no grid).
  const grid = element.querySelector('[class*="grid-wrapper"]');
  if (grid) {
    const introRow = heading ? heading.closest('.-oneX-row') : null;
    element.prepend(block);
    if (introRow && introRow !== block && !introRow.contains(grid)) {
      introRow.remove();
    }
  } else {
    element.replaceWith(block);
  }
}

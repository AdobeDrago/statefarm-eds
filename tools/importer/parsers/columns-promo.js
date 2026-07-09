/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-promo. Base: columns.
 * Source: State Farm partner promo (#ting) — light 2-column layout.
 *
 * Library structure (Columns): first row = block name; content rows share the
 * same column count.
 *
 * This variant is a 2-column partner promo:
 *   Col 1: partner logo image + heading + copy + secondary button link
 *   Col 2: product image
 *
 * The source repeats the product image across responsive breakpoints
 * (mobile-only + desktop-only). We use the desktop/picture image for the
 * product column and dedupe the mobile-only duplicate.
 */
export default function parse(element, { document }) {
  // The text/content column holds the logo, heading, copy, and CTA button.
  const heading = element.querySelector('h2, h3, h4, [class*="heading"]');
  const contentCol = heading ? heading.closest('[class*="-oneX-col"]') : null;

  // Logo image: the image inside the content column (above the heading)
  let logo = null;
  if (contentCol) {
    logo = contentCol.querySelector('img');
  }

  // Copy paragraph
  const copy = element.querySelector('p');

  // CTA button link
  const cta = element.querySelector('a[class*="btn"], a[role="button"], a[class*="anchor"]');

  // Product image: a picture-based image NOT inside the content column and not
  // the logo. Prefer the responsive <picture> variant.
  let productImg = null;
  const pics = Array.from(element.querySelectorAll('picture img'));
  productImg = pics.find((img) => !contentCol || !contentCol.contains(img)) || null;
  if (!productImg) {
    // Fallback: any image outside the content column that isn't the logo
    productImg = Array.from(element.querySelectorAll('img'))
      .find((img) => img !== logo && (!contentCol || !contentCol.contains(img))) || null;
  }

  // Empty-block guard
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
  // 2-column content row: promo text | product image (pad to keep equal columns)
  cells.push([
    textCell.length ? textCell : '',
    imageCell.length ? imageCell : '',
  ]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-promo', cells });
  element.replaceWith(block);
}

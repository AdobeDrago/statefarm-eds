/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-quote. Base: hero.
 * Source: https://www.statefarm.com/insurance (and product masthead)
 * Generated for State Farm migration.
 *
 * Library structure (Hero): 1 column, 3 rows.
 *   Row 1: block name
 *   Row 2: background/supporting image (optional)
 *   Row 3: title (heading) + subheading + optional CTA
 *
 * The interactive quote form is decorative CTA chrome and is intentionally
 * NOT captured. We keep the heading, intro copy, and supporting image.
 */
export default function parse(element, { document }) {
  // Heading: first h1/h2 within the hero
  const heading = element.querySelector('h1, h2, [class*="heading"]');

  // Intro / supporting copy — the intro paragraph (not the disclaimer inside the form)
  const intro = element.querySelector('p.-oneX-body--intro-sm, .-oneX-body--intro-sm, :scope p');

  // Supporting image (right-hand illustration)
  const image = element.querySelector('picture img, img[class*="hero-img"], img');

  // Empty-block guard
  if (!heading && !intro && !image) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2: background/supporting image (optional)
  if (image) {
    cells.push([image]);
  }

  // Row 3: single cell containing title + subheading + CTA
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (intro) contentCell.push(intro);
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-quote', cells });
  element.replaceWith(block);
}

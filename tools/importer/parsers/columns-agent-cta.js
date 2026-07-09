/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-agent-cta. Base: columns.
 * Source: State Farm find-an-agent / bundle CTA (red accent 2-column).
 *
 * Library structure (Columns): first row = block name; content rows have a
 * matching column count; each cell becomes a responsive column.
 *
 * This variant is a 2-column CTA:
 *   Col 1: heading + copy (the zip/find-agent form is CTA chrome — skipped)
 *   Col 2: agent image
 */
export default function parse(element, { document }) {
  const heading = element.querySelector('h2, h3, [class*="typography-variant"], [class*="heading"]');

  // Intro/supporting copy paragraph (not label text inside the form)
  let copy = null;
  const paras = element.querySelectorAll('p');
  for (const p of paras) {
    if (!p.closest('form')) { copy = p; break; }
  }

  // Agent image (right column)
  const image = element.querySelector('[class*="agent_container"] img, [class*="agent_img"], picture img, img');

  // Empty-block guard
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
  // 2-column content row: text | image (pad empties to keep column count equal)
  cells.push([
    textCell.length ? textCell : '',
    imageCell.length ? imageCell : '',
  ]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-agent-cta', cells });
  element.replaceWith(block);
}

/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-checklist. Base: cards (no images variant).
 * Source: State Farm "what you need" checklists (#what-do-i-need / #types).
 *
 * Library structure (Cards, no images): 1 column, multiple rows.
 *   Row 1: block name
 *   Each subsequent row = one card, single cell containing:
 *     Heading/label + a bulleted list (and any footnote copy)
 *
 * The decorative pictogram icons are not authorable images, so the text-only
 * "no images" single-column shape applies.
 */
export default function parse(element, { document }) {
  // Each checklist card contains a heading and a <ul>. Find the innermost
  // wrappers that hold both a heading and a list.
  let cards = Array.from(element.querySelectorAll('div'))
    .filter((d) => d.querySelector(':scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6')
      && d.querySelector(':scope > ul'));

  // Deduplicate nested matches: keep the deepest wrapper per list.
  cards = cards.filter((d) => !cards.some((other) => other !== d && d.contains(other)));

  // Empty-block guard
  if (cards.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  cards.forEach((card) => {
    // Single "text" richtext field — emit a field hint before the content so
    // migrated content maps to the cards-checklist-item model in UE.
    const cell = document.createDocumentFragment();
    cell.appendChild(document.createComment(' field:text '));
    let hasContent = false;
    const heading = card.querySelector(':scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6');
    if (heading) { cell.appendChild(heading); hasContent = true; }
    const list = card.querySelector(':scope > ul');
    if (list) { cell.appendChild(list); hasContent = true; }
    // Optional footnote paragraph within the card
    const footnote = card.querySelector(':scope > p');
    if (footnote) { cell.appendChild(footnote); hasContent = true; }
    if (hasContent) {
      // 1-column card row: single cell holding heading + list
      cells.push([cell]);
    }
  });

  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-checklist', cells });
  element.replaceWith(block);
}

/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-subnav. Base: columns.
 * Source: State Farm sticky sub-navigation (#subnav) — an "Explore" box with
 * page links plus a zip quote form.
 *
 * Library structure (Columns): first row = block name; content rows share the
 * same column count.
 *
 * We capture the sub-navigation links (the authorable content). The zip quote
 * form is interactive chrome and is intentionally skipped. Modeled as a single
 * column whose cell holds the Explore label and the list of nav links.
 */
export default function parse(element, { document }) {
  // The Explore navigation list
  const exploreList = element.querySelector('ul.-oneX-subnav-explore, [class*="subnav-explore"], ul');

  // Collect nav links (skip the current-page anchor that has no href)
  const linkEls = [];
  if (exploreList) {
    exploreList.querySelectorAll('li').forEach((li) => {
      const a = li.querySelector('a[href]');
      if (a) {
        linkEls.push(a);
      } else {
        // current page: represent as plain text paragraph so it isn't lost
        const span = li.querySelector('span, a');
        if (span && span.textContent.trim()) {
          const p = document.createElement('p');
          p.textContent = span.textContent.trim();
          linkEls.push(p);
        }
      }
    });
  }

  // Empty-block guard
  if (linkEls.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const contentCell = [];
  // Wrap each link in its own paragraph so links render as a stacked list
  linkEls.forEach((el) => {
    if (el.tagName === 'A') {
      const p = document.createElement('p');
      p.appendChild(el);
      contentCell.push(p);
    } else {
      contentCell.push(el);
    }
  });

  const cells = [];
  // Single-column content row holding the nav links
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-subnav', cells });
  element.replaceWith(block);
}

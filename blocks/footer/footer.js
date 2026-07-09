// State Farm footer — content-first. Reads footer.plain.html and lays out
// the banner, brand column, link columns, legal links, and copyright.

export default async function decorate(block) {
  const footerMeta = block.querySelector('a[href]')?.getAttribute('href');
  const footerPath = footerMeta || '/footer';

  let resp = await fetch(`${footerPath}.plain.html`);
  if (!resp.ok) return;

  const html = await resp.text();
  const tmp = document.createElement('div');
  tmp.innerHTML = html;

  const sections = [...tmp.children];
  // sections: [banner, brand, ...columns, legal, copyright]
  const banner = sections.shift();
  const brand = sections.shift();
  const copyright = sections.pop();
  const legal = sections.pop();
  const columns = sections; // remaining are link columns

  const footer = document.createElement('div');
  footer.className = 'footer-inner';

  if (banner) {
    banner.className = 'footer-banner';
    footer.append(banner);
  }

  const content = document.createElement('div');
  content.className = 'footer-content';

  if (brand) {
    brand.className = 'footer-brand';
    content.append(brand);
  }

  const cols = document.createElement('div');
  cols.className = 'footer-columns';
  columns.forEach((c) => {
    c.className = 'footer-column';
    cols.append(c);
  });
  content.append(cols);
  footer.append(content);

  if (legal) {
    legal.className = 'footer-legal';
    footer.append(legal);
  }
  if (copyright) {
    copyright.className = 'footer-copyright';
    footer.append(copyright);
  }

  block.textContent = '';
  block.append(footer);
}

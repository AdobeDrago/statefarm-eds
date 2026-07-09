// State Farm header — content-first, generic. Reads nav.plain.html and builds
// a brand row, primary nav, utility links, a search toggle, and a mobile menu.

function wrapImageLinks(section) {
  // no-op hook kept for parity; images already anchored in fragment
  return section;
}

export default async function decorate(block) {
  // Resolve nav fragment path (localhost/aem up first, then DA/EDS production).
  const navMeta = block.querySelector('a[href]')?.getAttribute('href');
  const navPath = navMeta || '/nav';

  let resp = await fetch('/content/nav.plain.html');
  if (!resp.ok) {
    resp = await fetch(`${navPath}.plain.html`);
  }
  if (!resp.ok) return;

  const html = await resp.text();
  const tmp = document.createElement('div');
  tmp.innerHTML = html;

  const sections = [...tmp.children];
  const [brandSection, primarySection, utilitySection] = sections;

  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Main navigation');

  // --- Brand (logo) ---
  const brand = document.createElement('div');
  brand.className = 'nav-brand';
  if (brandSection) brand.append(...brandSection.childNodes);
  wrapImageLinks(brand);

  // --- Hamburger toggle (mobile) ---
  const hamburger = document.createElement('button');
  hamburger.className = 'nav-hamburger';
  hamburger.setAttribute('aria-label', 'Open navigation');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.innerHTML = '<span></span><span></span><span></span>';

  // --- Primary nav ---
  const primary = document.createElement('div');
  primary.className = 'nav-primary';
  if (primarySection) {
    const list = primarySection.querySelector('ul');
    if (list) primary.append(list);
  }

  // --- Utility (login/help/locale) + search ---
  const tools = document.createElement('div');
  tools.className = 'nav-tools';

  const search = document.createElement('button');
  search.className = 'nav-search';
  search.setAttribute('aria-label', 'Search');
  search.textContent = 'Search';
  tools.append(search);

  if (utilitySection) {
    const list = utilitySection.querySelector('ul');
    if (list) tools.append(list);
  }

  nav.append(brand, hamburger, primary, tools);
  block.textContent = '';
  block.append(nav);

  // --- Behavior: mobile toggle ---
  const closeMenu = () => {
    nav.classList.remove('nav-open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open navigation');
  };
  hamburger.addEventListener('click', () => {
    const open = nav.classList.toggle('nav-open');
    hamburger.setAttribute('aria-expanded', String(open));
    hamburger.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });

  // Reset mobile state when resizing up to desktop
  const desktop = window.matchMedia('(min-width: 900px)');
  const onChange = () => { if (desktop.matches) closeMenu(); };
  if (desktop.addEventListener) desktop.addEventListener('change', onChange);
  else desktop.addListener(onChange);
}

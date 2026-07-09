export default async function decorate(block) {
  const navMeta = block.querySelector('a[href]')?.getAttribute('href');
  const navPath = navMeta || '/nav';

  const resp = await fetch(`${navPath}.plain.html`);
  if (!resp.ok) return;

  const html = await resp.text();
  const tmp = document.createElement('div');
  tmp.innerHTML = html;

  const sections = [...tmp.children];
  const [brandSection, primarySection, utilitySection, loginSection] = sections;

  // --- Utility bar (grey strip, full-width, above main nav) ---
  // Search is NOT in the utility bar — it lives in the main nav (hardcoded)
  const utilityBar = document.createElement('div');
  utilityBar.className = 'nav-utility-bar';

  if (utilitySection) {
    const list = utilitySection.querySelector('ul');
    if (list) utilityBar.append(list);
  }

  // --- Main nav ---
  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Main navigation');

  const brand = document.createElement('div');
  brand.className = 'nav-brand';
  if (brandSection) brand.append(...brandSection.childNodes);

  const hamburger = document.createElement('button');
  hamburger.className = 'nav-hamburger';
  hamburger.setAttribute('aria-label', 'Open navigation');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.innerHTML = '<span></span><span></span><span></span>';

  const primary = document.createElement('div');
  primary.className = 'nav-primary';
  if (primarySection) {
    const list = primarySection.querySelector('ul');
    if (list) primary.append(list);
  }

  // --- Search button (hardcoded, placed between primary links and login) ---
  const searchBtn = document.createElement('button');
  searchBtn.className = 'nav-search';
  searchBtn.setAttribute('aria-label', 'Search');
  searchBtn.setAttribute('aria-expanded', 'false');
  searchBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`;

  const login = document.createElement('div');
  login.className = 'nav-login';
  if (loginSection) {
    const list = loginSection.querySelector('ul');
    if (list) login.append(list);
  }

  nav.append(brand, hamburger, primary, searchBtn, login);

  // --- Search pane (full-width, appended to .header outside <nav>) ---
  const searchPane = document.createElement('div');
  searchPane.className = 'nav-search-pane';
  searchPane.setAttribute('role', 'search');
  searchPane.innerHTML = `
    <form class="nav-search-form" action="/search" method="get">
      <input type="search" name="q" class="nav-search-input" placeholder="Search statefarm.com" autocomplete="off" aria-label="Search statefarm.com">
      <button type="submit" class="nav-search-submit" aria-label="Submit search">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      </button>
    </form>
    <button class="nav-search-close" aria-label="Close search">&times;</button>
  `;

  block.textContent = '';
  block.append(utilityBar, nav, searchPane);

  // --- Search pane toggle logic ---
  const searchInput = searchPane.querySelector('.nav-search-input');
  const searchClose = searchPane.querySelector('.nav-search-close');

  const openSearch = () => {
    searchPane.classList.add('is-open');
    searchBtn.setAttribute('aria-expanded', 'true');
    searchInput.focus();
  };

  const closeSearch = () => {
    searchPane.classList.remove('is-open');
    searchBtn.setAttribute('aria-expanded', 'false');
  };

  searchBtn.addEventListener('click', () => {
    const isOpen = searchPane.classList.contains('is-open');
    if (isOpen) closeSearch();
    else openSearch();
  });

  searchClose.addEventListener('click', closeSearch);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchPane.classList.contains('is-open')) {
      closeSearch();
      searchBtn.focus();
    }
  });

  // --- Mobile toggle ---
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

  const desktop = window.matchMedia('(min-width: 900px)');
  const onChange = () => { if (desktop.matches) closeMenu(); };
  if (desktop.addEventListener) desktop.addEventListener('change', onChange);
  else desktop.addListener(onChange);
}
